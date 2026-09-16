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

    // Find seller profile
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

    // Fetch products belonging to this seller
    let products = await sql`
      SELECT * FROM products 
      WHERE seller_profile_id = ${profileId}
      ORDER BY id ASC
    `;

    // If no products assigned to this seller yet, return empty list
    if (!products || products.length === 0) {
      return NextResponse.json([]);
    }

    // Fetch points
    const pointsRows = await sql`SELECT product_id, point FROM product_points`;
    const pointsMap: Record<string, string[]> = {};
    for (const row of pointsRows) {
      const pId = String(row.product_id);
      if (!pointsMap[pId]) pointsMap[pId] = [];
      pointsMap[pId].push(row.point);
    }

    const dtos = products.map((p: any) => ({
      id: String(p.id),
      name: p.name,
      price: p.price,
      value: p.value,
      accValue: p.acc_value,
      discount: p.discount,
      mrp: p.mrp,
      category: p.category,
      url: p.url,
      resUrl: p.res_url || p.url,
      bestSeller: Boolean(p.best_seller),
      todayDeal: Boolean(p.today_deal),
      newRelease: Boolean(p.new_release),
      points: pointsMap[String(p.id)] || [],
    }));

    return NextResponse.json(dtos);
  } catch (err: unknown) {
    console.error("GET seller products error:", err);
    return NextResponse.json([], { status: 500 });
  }
}
