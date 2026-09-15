import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const reqRow = await sql`
      SELECT sr.id, sr.requester_id, sr.status, u.name as user_name, u.email as user_email
      FROM seller_requests sr
      LEFT JOIN users u ON sr.requester_id = u.id
      WHERE sr.id = ${id}
      LIMIT 1
    `;

    if (!reqRow || reqRow.length === 0) {
      return NextResponse.json({ status: "FAILED", message: "Request not found" }, { status: 404 });
    }

    await sql`UPDATE seller_requests SET status = 'REJECTED' WHERE id = ${id}`;

    // Record system notification
    const notifId = crypto.randomUUID();
    const payload = JSON.stringify({ requestId: id, name: reqRow[0].user_name, email: reqRow[0].user_email });
    await sql`
      INSERT INTO notifications (id, type, payload, created_at, is_read)
      VALUES (${notifId}, 'SELLER_REQUEST_REJECTED', ${payload}, NOW(), false)
    `;

    return NextResponse.json({ status: "REJECTED" });
  } catch (err: unknown) {
    console.error("Seller request reject error:", err);
    const message = err instanceof Error ? err.message : "Rejection failed";
    return NextResponse.json({ status: "FAILED", message }, { status: 500 });
  }
}
