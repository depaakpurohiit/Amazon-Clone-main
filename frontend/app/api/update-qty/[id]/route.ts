import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sql } from "@/lib/db";

async function getAuthUser() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("tradehive_session");
  if (!sessionCookie?.value) return null;
  try {
    return JSON.parse(sessionCookie.value);
  } catch {
    return null;
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const { searchParams } = new URL(request.url);
  const qty = searchParams.get("qty") || "1";
  const parsedQty = parseInt(qty, 10);
  const user = await getAuthUser();

  if (user) {
    const userId = String(user._id || user.id);
    try {
      if (parsedQty <= 0) {
        await sql`
          DELETE FROM cart_items 
          WHERE (id::text = ${id} OR product_id = ${id}) 
            AND user_id = ${userId}
        `;
      } else {
        await sql`
          UPDATE cart_items 
          SET qty = ${parsedQty} 
          WHERE (id::text = ${id} OR product_id = ${id}) 
            AND user_id = ${userId}
        `;
      }

      // Re-fetch current cart
      const cartRows = await sql`
        SELECT c.id as cart_item_id, c.product_id, c.qty, p.name, p.url, p.acc_value, p.price
        FROM cart_items c
        LEFT JOIN products p ON c.product_id = p.id
        WHERE c.user_id = ${userId}
        ORDER BY c.id ASC
      `;

      const formattedCart = cartRows.map((r: any) => ({
        id: String(r.cart_item_id),
        cartItem: {
          id: String(r.product_id),
          name: r.name || "Product",
          url: r.url || "/images/NoImage.jpg",
          accValue: Number(r.acc_value) || 0,
        },
        qty: Number(r.qty) || 1,
      }));

      // Update session cookie
      user.cart = formattedCart;
      const cookieStore = await cookies();
      cookieStore.set("tradehive_session", JSON.stringify(user), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      return NextResponse.json({
        status: true,
        message: "Cart item quantity updated",
        cartItemId: id,
        qty: parsedQty,
        cart: formattedCart,
      });
    } catch (dbErr) {
      console.error("Error updating cart_items quantity:", dbErr);
    }
  }

  return NextResponse.json({
    status: true,
    message: "Cart item quantity updated",
    cartItemId: id,
    qty: parsedQty,
  });
}
