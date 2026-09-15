import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import fallbackProducts from "@/data/products.json";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const tag = searchParams.get("tag");

  try {
    const rows = await sql`SELECT * FROM products ORDER BY id ASC`;
    const pointsRows = await sql`SELECT product_id, point FROM product_points`;

    const pointsMap: Record<string, string[]> = {};
    for (const r of pointsRows) {
      const pId = String(r.product_id);
      if (!pointsMap[pId]) pointsMap[pId] = [];
      pointsMap[pId].push(String(r.point));
    }

    let products = rows.map((p: any) => ({
      id: String(p.id),
      url: p.url || "/images/NoImage.jpg",
      resUrl: p.res_url || p.url || "/images/NoImage.jpg",
      price: p.price,
      value: p.value,
      accValue: p.acc_value ? parseInt(p.acc_value, 10) : undefined,
      discount: p.discount,
      mrp: p.mrp,
      name: p.name,
      category: p.category,
      points: pointsMap[String(p.id)] || [],
      sellerId: p.seller_profile_id || undefined,
    }));

    if (category && category.toUpperCase() !== "ALL") {
      products = products.filter(
        (p) => p.category?.toUpperCase() === category.toUpperCase()
      );
    }

    if (tag) {
      const t = tag.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(t) ||
          p.category?.toLowerCase().includes(t)
      );
    }

    return NextResponse.json(products);
  } catch (err) {
    console.error("Neon DB query error, using synced catalog:", err);
    let filtered = [...fallbackProducts];
    if (category && category.toUpperCase() !== "ALL") {
      filtered = filtered.filter(
        (p) => p.category?.toUpperCase() === category.toUpperCase()
      );
    }
    return NextResponse.json(filtered);
  }
}
