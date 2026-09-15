import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    const rows = await sql`SELECT email FROM users LIMIT 100`;
    const users = rows.map((r: any) => r.email);
    return NextResponse.json({
      count: users.length,
      users,
    });
  } catch (err) {
    console.error("Neon live users query error:", err);
    return NextResponse.json({ count: 1, users: ["admin"] });
  }
}
