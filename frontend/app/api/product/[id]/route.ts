import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import fallbackProducts from "@/data/products.json";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const decodedId = decodeURIComponent(id);

  try {
    const rows = await sql`SELECT * FROM products WHERE id = ${decodedId} LIMIT 1`;
    if (rows.length > 0) {
      const p = rows[0] as any;
      const pointsRows = await sql`SELECT point FROM product_points WHERE product_id = ${decodedId}`;
      const points = pointsRows.map((r: any) => String(r.point));

      return NextResponse.json({
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
        points: points,
        sellerId: p.seller_profile_id || undefined,
      });
    }
  } catch (err) {
    console.error("Neon product lookup error:", err);
  }

  const product = fallbackProducts.find(
    (p) =>
      String(p.id) === decodedId ||
      String(p.id).toLowerCase() === decodedId.toLowerCase()
  );

  if (!product) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}
