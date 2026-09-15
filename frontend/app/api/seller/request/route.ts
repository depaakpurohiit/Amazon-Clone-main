import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sql } from "@/lib/db";

export async function POST(request: Request) {
  try {
    let body: any = {};
    try {
      body = await request.json();
    } catch {
      body = {};
    }

    let userId: string | null = null;
    let userName = "Applicant";
    let userEmail = "unknown@tradehive.com";

    // 1. Try reading user from session cookie
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("tradehive_session");
    if (sessionCookie?.value) {
      try {
        const parsed = JSON.parse(sessionCookie.value);
        if (parsed?.id) {
          userId = parsed.id;
          userName = parsed.name || userName;
          userEmail = parsed.email || userEmail;
        }
      } catch (err) {
        console.error("Session parse error:", err);
      }
    }

    // 2. Fallback to userId passed in body if testing/dev
    if (!userId && body.userId) {
      userId = body.userId;
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    // Check if user exists in DB
    const userRows = await sql`SELECT id, name, email FROM users WHERE id = ${userId} LIMIT 1`;
    if (userRows.length > 0) {
      userName = userRows[0].name || userName;
      userEmail = userRows[0].email || userEmail;
    }

    const requestId = crypto.randomUUID();
    const message = body.message || "Seller account verification request";

    // Insert pending request
    await sql`
      INSERT INTO seller_requests (id, requester_id, message, status, created_at)
      VALUES (${requestId}, ${userId}, ${message}, 'PENDING', NOW())
    `;

    // Record notification for admin
    const notifId = crypto.randomUUID();
    const payload = JSON.stringify({ requestId, userId, name: userName, email: userEmail });
    await sql`
      INSERT INTO notifications (id, type, payload, created_at, is_read)
      VALUES (${notifId}, 'SELLER_REQUEST', ${payload}, NOW(), false)
    `;

    return NextResponse.json({ requestId, status: "PENDING" }, { status: 201 });
  } catch (err: unknown) {
    console.error("Create seller request error:", err);
    const message = err instanceof Error ? err.message : "Failed to create seller request";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
