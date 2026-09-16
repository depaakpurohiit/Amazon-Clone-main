import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(
  _request: Request,
  context: { params: Promise<{ sellerId: string }> }
) {
  const { sellerId } = await context.params;
  try {
    const products = await sql`
      SELECT * FROM products 
      WHERE seller_profile_id = ${sellerId}
      ORDER BY id ASC
    `;

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
      points: [],
    }));

    return NextResponse.json(dtos);
  } catch (err: unknown) {
    console.error("GET public seller products error:", err);
    return NextResponse.json([], { status: 500 });
  }
}
