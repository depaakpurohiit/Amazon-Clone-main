import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(
  _request: Request,
  context: { params: Promise<{ sellerId: string }> }
) {
  const { sellerId } = await context.params;
  try {
    const rows = await sql`
      SELECT sp.*, u.name as user_name, u.email as user_email
      FROM seller_profiles sp
      LEFT JOIN users u ON sp.user_id = u.id
      WHERE sp.id = ${sellerId} OR sp.user_id = ${sellerId}
      LIMIT 1
    `;

    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: "Seller profile not found" }, { status: 404 });
    }

    const p = rows[0];
    return NextResponse.json({
      id: String(p.id),
      userId: String(p.user_id),
      businessName: p.business_name || (p.user_name ? `${p.user_name}'s Store` : "Seller Store"),
      bio: p.bio || "Authorized Trade Hive seller.",
      logoUrl: p.logo_url || null,
      status: p.status || "APPROVED",
    });
  } catch (err: unknown) {
    console.error("GET seller public profile error:", err);
    return NextResponse.json({ error: "Failed to fetch seller profile" }, { status: 500 });
  }
}
