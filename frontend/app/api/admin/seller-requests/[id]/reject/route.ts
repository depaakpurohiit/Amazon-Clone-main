import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    await sql`UPDATE seller_requests SET status = 'REJECTED' WHERE id = ${id}`;
    return NextResponse.json({ status: "REJECTED" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Rejection failed";
    return NextResponse.json({ status: "FAILED", message }, { status: 500 });
  }
}
