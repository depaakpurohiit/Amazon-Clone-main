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

export async function PUT(
  request: Request,
  context: { params: Promise<{ productId: string }> }
) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const { productId } = await context.params;
    const body = await request.json();

    const name = body.name ? String(body.name).trim() : null;
    const category = body.category ? String(body.category).trim() : null;
    const url = body.url ? String(body.url).trim() : null;
    const resUrl = body.resUrl ? String(body.resUrl).trim() : url;
    const price = body.price ? (String(body.price).startsWith("₹") ? String(body.price) : `₹${body.price}`) : null;
    const mrp = body.mrp ? (String(body.mrp).startsWith("₹") ? String(body.mrp) : `₹${body.mrp}`) : price;
    const discount = body.discount ? String(body.discount) : null;
    const value = body.value ? String(body.value) : price;
    const accValue = body.accValue != null ? String(body.accValue) : "0";

    await sql`
      UPDATE products
      SET 
        name = COALESCE(${name}, name),
        category = COALESCE(${category}, category),
        url = COALESCE(${url}, url),
        res_url = COALESCE(${resUrl}, res_url),
        price = COALESCE(${price}, price),
        mrp = COALESCE(${mrp}, mrp),
        discount = COALESCE(${discount}, discount),
        value = COALESCE(${value}, value),
        acc_value = COALESCE(${accValue}, acc_value)
      WHERE id = ${productId}
    `;

    return NextResponse.json({
      status: true,
      message: "Product updated successfully",
      productId,
    });
  } catch (err: unknown) {
    console.error("PUT seller product error:", err);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ productId: string }> }
) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const { productId } = await context.params;

    // Remove any product points and cart items referencing this product
    try {
      await sql`DELETE FROM product_points WHERE product_id = ${productId}`;
      await sql`DELETE FROM cart_items WHERE product_id = ${productId}`;
      await sql`DELETE FROM favorites WHERE product_id = ${productId}`;
    } catch (cleanErr) {
      console.warn("Product cleanup notice:", cleanErr);
    }

    // Delete product from products table
    await sql`DELETE FROM products WHERE id = ${productId}`;

    return NextResponse.json({
      status: true,
      message: "Product removed successfully",
      productId,
    });
  } catch (err: unknown) {
    console.error("DELETE seller product error:", err);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
