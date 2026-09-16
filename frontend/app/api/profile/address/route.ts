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

export async function PUT(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { address, lat, lng } = body;

    if (!address || !String(address).trim()) {
      return NextResponse.json({ error: "Address is required" }, { status: 400 });
    }

    const userId = String(user._id || user.id);
    const userEmail = user.email ? String(user.email).trim().toLowerCase() : "";
    const cleanAddress = String(address).trim();
    const cleanLat = lat != null ? Number(lat) : null;
    const cleanLng = lng != null ? Number(lng) : null;

    // 1. Update Neon PostgreSQL users table
    await sql`
      UPDATE users 
      SET address = ${cleanAddress}, lat = ${cleanLat}, lng = ${cleanLng}
      WHERE id = ${userId} OR LOWER(email) = ${userEmail}
    `;

    // 2. Update session cookie
    user.address = cleanAddress;
    user.lat = cleanLat;
    user.lng = cleanLng;

    const cookieStore = await cookies();
    cookieStore.set("tradehive_session", JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({
      status: true,
      message: "Delivery address updated successfully",
      address: cleanAddress,
      lat: cleanLat,
      lng: cleanLng,
    });
  } catch (err: unknown) {
    console.error("PUT profile address error:", err);
    return NextResponse.json({ error: "Failed to update address" }, { status: 500 });
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

    const rows = await sql`
      SELECT address, lat, lng 
      FROM users 
      WHERE id = ${userId} OR LOWER(email) = ${userEmail} 
      LIMIT 1
    `;

    if (rows && rows.length > 0) {
      return NextResponse.json({
        address: rows[0].address || "India",
        lat: rows[0].lat != null ? Number(rows[0].lat) : null,
        lng: rows[0].lng != null ? Number(rows[0].lng) : null,
      });
    }

    return NextResponse.json({
      address: user.address || "India",
      lat: user.lat ?? null,
      lng: user.lng ?? null,
    });
  } catch (err: unknown) {
    console.error("GET profile address error:", err);
    return NextResponse.json({ error: "Failed to fetch address" }, { status: 500 });
  }
}
