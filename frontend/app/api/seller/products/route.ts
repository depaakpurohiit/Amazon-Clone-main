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

export async function POST(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const userId = String(user._id || user.id);
    const userEmail = user.email ? String(user.email).trim().toLowerCase() : "";

    // 1. Find seller profile
    let profileRows = await sql`
      SELECT sp.id, sp.status FROM seller_profiles sp
      JOIN users u ON sp.user_id = u.id
      WHERE sp.user_id = ${userId} OR LOWER(u.email) = ${userEmail}
      LIMIT 1
    `;

    let profileId: string;
    if (profileRows && profileRows.length > 0) {
      profileId = profileRows[0].id;
    } else {
      // Auto-create a seller profile if user is a seller
      profileId = crypto.randomUUID();
      await sql`
        INSERT INTO seller_profiles (id, user_id, business_name, status, created_at)
        VALUES (${profileId}, ${userId}, ${(user.name || "Seller") + "'s Store"}, 'APPROVED', NOW())
      `;
    }

    const body = await request.json();
    const { name, category, url, resUrl, price, mrp, discount, value, accValue } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Product name is required" }, { status: 400 });
    }

    const productId = crypto.randomUUID();
    const priceStr = price ? (String(price).startsWith("₹") ? String(price) : `₹${price}`) : "₹0";
    const mrpStr = mrp ? (String(mrp).startsWith("₹") ? String(mrp) : `₹${mrp}`) : priceStr;
    const mainUrl = url && url.trim() ? url.trim() : "/images/NoImage.jpg";
    const secondaryUrl = resUrl && resUrl.trim() ? resUrl.trim() : mainUrl;

    await sql`
      INSERT INTO products (
        id, name, category, url, res_url, price, mrp, discount, value, acc_value,
        best_seller, today_deal, new_release, seller_profile_id
      ) VALUES (
        ${productId},
        ${name.trim()},
        ${category && category.trim() ? category.trim() : "Electronics"},
        ${mainUrl},
        ${secondaryUrl},
        ${priceStr},
        ${mrpStr},
        ${discount ? String(discount) : "0"},
        ${value ? String(value) : priceStr},
        ${String(accValue ?? 0)},
        false,
        false,
        true,
        ${profileId}
      )
    `;

    return NextResponse.json({
      status: true,
      productId: productId,
      message: "Product created successfully",
    }, { status: 201 });
  } catch (err: unknown) {
    console.error("Create seller product error:", err);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const userId = String(user._id || user.id);
    const userEmail = user.email ? String(user.email).trim().toLowerCase() : "";

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
    const products = await sql`
      SELECT * FROM products 
      WHERE seller_profile_id = ${profileId}
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
    console.error("GET seller products error:", err);
    return NextResponse.json([], { status: 500 });
  }
}
