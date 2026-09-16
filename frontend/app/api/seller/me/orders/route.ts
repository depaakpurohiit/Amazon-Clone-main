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

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const userId = user._id || user.id;
    const userEmail = user.email ? String(user.email).trim().toLowerCase() : "";

    // Query seller profile
    const profileRows = await sql`
      SELECT sp.id FROM seller_profiles sp
      JOIN users u ON sp.user_id = u.id
      WHERE sp.user_id = ${userId} OR LOWER(u.email) = ${userEmail}
      LIMIT 1
    `;

    if (!profileRows || profileRows.length === 0) {
      return NextResponse.json([]);
    }

    const profileId = profileRows[0].id;

    // Fetch seller orders
    try {
      const orders = await sql`
        SELECT o.id, o.user_id, o.date_ordered, o.is_paid, o.amount, u.name as customer_name
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        ORDER BY o.date_ordered DESC
        LIMIT 20
      `;

      const dtos = orders.map((o: any) => ({
        id: String(o.id),
        userId: o.user_id ? String(o.user_id) : null,
        customerName: o.customer_name || "Customer",
        dateOrdered: o.date_ordered ? new Date(o.date_ordered).toISOString() : new Date().toISOString(),
        isPaid: Boolean(o.is_paid),
        sellerTotal: Number(o.amount) || 0,
        items: [],
      }));

      return NextResponse.json(dtos);
    } catch {
      return NextResponse.json([]);
    }
  } catch (err: unknown) {
    console.error("GET seller orders error:", err);
    return NextResponse.json([], { status: 500 });
  }
}
