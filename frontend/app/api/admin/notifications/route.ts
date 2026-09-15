import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    const rows = await sql`SELECT * FROM notifications ORDER BY created_at DESC LIMIT 50`;
    const notifs = rows.map((r: any) => ({
      id: String(r.id),
      type: r.type,
      payload: r.payload,
      isRead: r.is_read,
      createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
    }));
    return NextResponse.json(notifs);
  } catch (err) {
    console.error("Neon notifications query error:", err);
    return NextResponse.json([]);
  }
}

export async function DELETE() {
  try {
    await sql`DELETE FROM notifications`;
    return NextResponse.json({ status: "SUCCESS" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Clear failed";
    return NextResponse.json({ status: "FAILED", message }, { status: 500 });
  }
}
