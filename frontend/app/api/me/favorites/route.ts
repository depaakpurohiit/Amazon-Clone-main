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
      return NextResponse.json([]);
    }

    const userId = String(user._id || user.id);
    const rows = await sql`
      SELECT p.*
      FROM favorites f
      JOIN products p ON f.product_id = p.id
      WHERE f.user_id = ${userId}
      ORDER BY f.created_at DESC
    `;

    const dtos = rows.map((p: any) => ({
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
      points: [],
    }));

    return NextResponse.json(dtos);
  } catch (err: unknown) {
    console.error("GET favorites error:", err);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const productId = body.productId ? String(body.productId) : null;
    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const userId = String(user._id || user.id);

    // Check if already in favorites
    const existing = await sql`
      SELECT id FROM favorites 
      WHERE user_id = ${userId} AND product_id = ${productId} 
      LIMIT 1
    `;

    if (!existing || existing.length === 0) {
      const favId = crypto.randomUUID();
      await sql`
        INSERT INTO favorites (id, user_id, product_id, created_at)
        VALUES (${favId}, ${userId}, ${productId}, NOW())
      `;
    }

    return NextResponse.json({ status: true, message: "Added to favorites" });
  } catch (err: unknown) {
    console.error("POST favorite error:", err);
    return NextResponse.json({ error: "Failed to add favorite" }, { status: 500 });
  }
}
