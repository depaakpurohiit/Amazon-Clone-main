import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    await sql`UPDATE seller_requests SET status = 'APPROVED' WHERE id = ${id}`;
    // Also approve user and seller profile if applicable
    const reqRow = await sql`SELECT requester_id FROM seller_requests WHERE id = ${id} LIMIT 1`;
    if (reqRow && reqRow.length > 0) {
      const uId = reqRow[0].requester_id;
      await sql`UPDATE users SET seller_approved = true, role = 'MANAGER' WHERE id = ${uId}`;
      await sql`UPDATE seller_profiles SET status = 'APPROVED' WHERE user_id = ${uId}`;
    }
    return NextResponse.json({ status: "APPROVED" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Approval failed";
    return NextResponse.json({ status: "FAILED", message }, { status: 500 });
  }
}
