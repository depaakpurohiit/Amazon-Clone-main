import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("tradehive_session");

    if (sessionCookie && sessionCookie.value) {
      try {
        const user = JSON.parse(sessionCookie.value);
        const userId = user._id || user.id;
        const userEmail = user.email ? String(user.email).trim().toLowerCase() : "";

        // Sync live profile and cart from Neon PostgreSQL
        try {
          const userRows = await sql`
            SELECT id, name, email, number, role, seller_approved, address, lat, lng
            FROM users
            WHERE id = ${userId} OR LOWER(email) = ${userEmail}
            LIMIT 1
          `;

          if (userRows && userRows.length > 0) {
            const dbUser = userRows[0];
            user._id = String(dbUser.id);
            user.name = dbUser.name || user.name;
            user.email = dbUser.email || user.email;
            user.number = dbUser.number || user.number;
            user.role = dbUser.role || user.role;
            user.sellerApproved = Boolean(dbUser.seller_approved);
            user.address = dbUser.address || user.address || "India";
            if (dbUser.lat != null) user.lat = Number(dbUser.lat);
            if (dbUser.lng != null) user.lng = Number(dbUser.lng);
          }

          const cartRows = await sql`
            SELECT c.id as cart_item_id, c.product_id, c.qty, p.name, p.url, p.acc_value, p.price
            FROM cart_items c
            LEFT JOIN products p ON c.product_id = p.id
            WHERE c.user_id = ${user._id}
            ORDER BY c.id ASC
          `;

          if (cartRows) {
            user.cart = cartRows.map((r: any) => ({
              id: String(r.cart_item_id),
              cartItem: {
                id: String(r.product_id),
                name: r.name || "Product",
                url: r.url || "/images/NoImage.jpg",
                accValue: Number(r.acc_value) || 0,
              },
              qty: Number(r.qty) || 1,
            }));
          }
        } catch (dbErr) {
          console.warn("getAuthUser DB sync warning:", dbErr);
        }

        return NextResponse.json(user, { status: 200 });
      } catch (parseErr) {
        console.error("Invalid session cookie JSON:", parseErr);
      }
    }

    // Return null with 200 status so unauthenticated visitors load cleanly without console errors
    return NextResponse.json(null, { status: 200 });
  } catch (err) {
    return NextResponse.json(null, { status: 200 });
  }
}
