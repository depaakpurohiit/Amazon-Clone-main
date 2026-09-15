import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    const rows = await sql`
      SELECT 
        sr.id,
        sr.requester_id,
        sr.message,
        sr.status,
        sr.created_at,
        u.name as requester_name,
        u.email as requester_email,
        u.number as requester_number
      FROM seller_requests sr
      LEFT JOIN users u ON sr.requester_id = u.id
      ORDER BY sr.created_at DESC
    `;

    const requests = rows.map((r: any) => ({
      id: String(r.id),
      requesterId: String(r.requester_id),
      requesterName: r.requester_name || "Applicant",
      requesterEmail: r.requester_email || "unknown@tradehive.com",
      requesterNumber: r.requester_number || "",
      message: r.message || "Seller verification request",
      status: r.status || "PENDING",
      createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
    }));

    return NextResponse.json(requests);
  } catch (err) {
    console.error("Neon seller-requests query error:", err);
    return NextResponse.json([]);
  }
}
