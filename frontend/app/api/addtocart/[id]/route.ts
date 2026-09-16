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

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const user = await getAuthUser();

  if (user) {
    const userId = String(user._id || user.id);
    try {
      // 1. Check if product already exists in cart_items
      const existing = await sql`
        SELECT id, qty FROM cart_items 
        WHERE user_id = ${userId} AND product_id = ${id} 
        LIMIT 1
      `;

      if (existing && existing.length > 0) {
        await sql`
          UPDATE cart_items 
          SET qty = qty + 1 
          WHERE id = ${existing[0].id}
        `;
      } else {
        await sql`
          INSERT INTO cart_items (user_id, product_id, qty) 
          VALUES (${userId}, ${id}, 1)
        `;
      }

      // 2. Fetch full current cart for this user
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

      // 3. Update session cookie
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
        message: "Product added to cart",
        productId: id,
        cart: formattedCart,
      });
    } catch (dbErr) {
      console.error("Error adding to cart_items:", dbErr);
    }
  }

  return NextResponse.json({
    status: true,
    message: "Product added to cart",
    productId: id,
  });
}
