import { NextResponse } from "next/server";
import products from "@/data/products.json";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const decodedId = decodeURIComponent(id);
  const product = products.find(
    (p) => String(p.id) === decodedId || String(p.id).toLowerCase() === decodedId.toLowerCase()
  );

  if (!product) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}
