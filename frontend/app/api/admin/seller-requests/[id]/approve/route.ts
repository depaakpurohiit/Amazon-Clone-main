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

    await sql`UPDATE seller_requests SET status = 'APPROVED' WHERE id = ${id}`;

    const uId = reqRow[0].requester_id;
    if (uId) {
      // 1. Promote user role and approve seller status
      await sql`UPDATE users SET seller_approved = true, role = 'MANAGER' WHERE id = ${uId}`;

      // 2. Ensure seller_profiles row is created or approved
      const existingProfile = await sql`SELECT id FROM seller_profiles WHERE user_id = ${uId} LIMIT 1`;
      if (existingProfile && existingProfile.length > 0) {
        await sql`UPDATE seller_profiles SET status = 'APPROVED' WHERE user_id = ${uId}`;
      } else {
        const profileId = crypto.randomUUID();
        const bName = (reqRow[0].user_name || "Seller") + "'s Store";
        await sql`
          INSERT INTO seller_profiles (id, user_id, business_name, status, created_at)
          VALUES (${profileId}, ${uId}, ${bName}, 'APPROVED', NOW())
        `;
      }

      // 3. Record system notification
      const notifId = crypto.randomUUID();
      const payload = JSON.stringify({ userId: uId, requestId: id, name: reqRow[0].user_name, email: reqRow[0].user_email });
      await sql`
        INSERT INTO notifications (id, type, payload, created_at, is_read)
        VALUES (${notifId}, 'SELLER_REQUEST_APPROVED', ${payload}, NOW(), false)
      `;
    }

    return NextResponse.json({ status: "APPROVED" });
  } catch (err: unknown) {
    console.error("Seller request approve error:", err);
    const message = err instanceof Error ? err.message : "Approval failed";
    return NextResponse.json({ status: "FAILED", message }, { status: 500 });
  }
}
