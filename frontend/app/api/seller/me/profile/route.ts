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

    // Query seller profile by user_id or user email
    let rows = await sql`
      SELECT sp.*, u.name as user_name, u.email as user_email
      FROM seller_profiles sp
      JOIN users u ON sp.user_id = u.id
      WHERE sp.user_id = ${userId} OR LOWER(u.email) = ${userEmail}
      LIMIT 1
    `;

    if (rows && rows.length > 0) {
      const p = rows[0];
      return NextResponse.json({
        id: String(p.id),
        userId: String(p.user_id),
        businessName: p.business_name || (p.user_name ? `${p.user_name}'s Store` : "Seller Store"),
        bio: p.bio || "Authorized Trade Hive seller specializing in authentic quality products.",
        logoUrl: p.logo_url || null,
        status: p.status || "APPROVED",
      });
    }

    // Default profile if none exists yet in DB
    return NextResponse.json({
      id: "",
      userId: userId,
      businessName: (user.name || "Seller") + "'s Store",
      bio: "Authorized Trade Hive seller specializing in authentic quality products.",
      logoUrl: null,
      status: user.sellerApproved ? "APPROVED" : "PENDING",
    });
  } catch (err: unknown) {
    console.error("GET seller profile error:", err);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const body = await request.json();
    const userId = user._id || user.id;
    const userEmail = user.email ? String(user.email).trim().toLowerCase() : "";

    let realUserId = userId;
    const userRow = await sql`SELECT id, name FROM users WHERE id = ${userId} OR LOWER(email) = ${userEmail} LIMIT 1`;
    if (userRow && userRow.length > 0) {
      realUserId = userRow[0].id;
    }

    const existingProfile = await sql`SELECT id, status FROM seller_profiles WHERE user_id = ${realUserId} LIMIT 1`;

    const bName = body.businessName || (user.name ? `${user.name}'s Store` : "Seller Store");
    const bio = body.bio || "";
    const logoUrl = body.logoUrl || null;

    if (existingProfile && existingProfile.length > 0) {
      const profileId = existingProfile[0].id;
      const status = existingProfile[0].status || "APPROVED";
      await sql`
        UPDATE seller_profiles
        SET business_name = ${bName}, bio = ${bio}, logo_url = ${logoUrl}
        WHERE id = ${profileId}
      `;
      return NextResponse.json({
        id: String(profileId),
        userId: String(realUserId),
        businessName: bName,
        bio: bio,
        logoUrl: logoUrl,
        status: status,
      });
    } else {
      const profileId = crypto.randomUUID();
      await sql`
        INSERT INTO seller_profiles (id, user_id, business_name, bio, logo_url, status, created_at)
        VALUES (${profileId}, ${realUserId}, ${bName}, ${bio}, ${logoUrl}, 'APPROVED', NOW())
      `;
      return NextResponse.json({
        id: profileId,
        userId: String(realUserId),
        businessName: bName,
        bio: bio,
        logoUrl: logoUrl,
        status: "APPROVED",
      });
    }
  } catch (err: unknown) {
    console.error("POST seller profile error:", err);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
