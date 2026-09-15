import { NextResponse } from "next/server";
import products from "@/data/products.json";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const tag = searchParams.get("tag");

  let filtered = [...products];

  if (category && category.toUpperCase() !== "ALL") {
    filtered = filtered.filter(
      (p) => p.category?.toUpperCase() === category.toUpperCase()
    );
  }

  if (tag) {
    const t = tag.toLowerCase();
    filtered = filtered.filter((p) =>
      p.name.toLowerCase().includes(t) || p.category?.toLowerCase().includes(t)
    );
  }

  return NextResponse.json(filtered);
}
