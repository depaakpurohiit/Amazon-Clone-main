import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    const rows = await sql`SELECT * FROM seller_profiles ORDER BY created_at DESC`;
    const sellers = rows.map((r: any) => ({
      id: String(r.id),
      userId: String(r.user_id),
      businessName: r.business_name,
      bio: r.bio,
      logoUrl: r.logo_url,
      status: r.status,
    }));
    return NextResponse.json(sellers);
  } catch (err) {
    console.error("Neon sellers query error:", err);
    return NextResponse.json([]);
  }
}
