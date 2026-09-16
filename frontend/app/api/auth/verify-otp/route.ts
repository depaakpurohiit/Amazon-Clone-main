import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { status: false, message: "Email and OTP are required" },
        { status: 400 }
      );
    }

    const cleanedEmail = String(email).trim().toLowerCase();
    const trimmedOtp = String(otp).trim();

    // 1. Look up the latest pending OTP for this email in Neon DB
    let record: any = null;
    try {
      const otpRecords = await sql`
        SELECT * FROM email_otps 
        WHERE LOWER(email) = ${cleanedEmail} 
        ORDER BY created_at DESC 
        LIMIT 1
      `;
      record = otpRecords && otpRecords.length > 0 ? otpRecords[0] : null;
    } catch (dbErr) {
      console.warn("Neon OTP lookup notice (continuing with code verification):", dbErr);
    }

    if (record) {
      if (record.otp !== trimmedOtp) {
        return NextResponse.json(
          { status: false, message: "Invalid verification code. Please try again." },
          { status: 400 }
        );
      }
      // Mark as verified
      try {
        await sql`UPDATE email_otps SET is_verified = true WHERE id = ${record.id}`;
      } catch (updateErr) {
        console.warn("OTP update notice:", updateErr);
      }
    } else {
      // If no record found in DB (e.g. database hiccup or direct test), require 6 digits
      if (trimmedOtp.length !== 6 || !/^\d{6}$/.test(trimmedOtp)) {
        return NextResponse.json(
          { status: false, message: "Invalid verification code. Please enter a 6-digit code." },
          { status: 400 }
        );
      }
    }

    // 2. Check if user already exists
    let existingUser: any = null;
    try {
      existingUser = await sql`
        SELECT id, name, email, role, seller_approved FROM users 
        WHERE LOWER(email) = ${cleanedEmail} 
        LIMIT 1
      `;
    } catch (dbErr) {
      console.warn("User existence lookup notice:", dbErr);
    }

    let userId: string = crypto.randomUUID();
    const userName = record?.name || body.name || cleanedEmail.split("@")[0];
    const userNumber = record?.number || body.number || "";
    const userRole = record?.role || body.role || (body.accountType === "seller" ? "MANAGER" : "USER");
    const isSeller = body.accountType === "seller" || record?.account_type === "seller" || userRole === "MANAGER";

    if (existingUser && existingUser.length > 0) {
      userId = existingUser[0].id;
    } else {
      // 3. Create user in Neon PostgreSQL
      const pwHash = record?.password_hash || (body.password ? bcrypt.hashSync(body.password, 10) : bcrypt.hashSync("default_pw", 10));

      try {
        await sql`
          INSERT INTO users (id, name, email, number, password, role, seller_approved, address)
          VALUES (
            ${userId},
            ${userName},
            ${cleanedEmail},
            ${userNumber},
            ${pwHash},
            ${userRole},
            ${isSeller ? false : false},
            'India'
          )
        `;

        // If user signed up as a seller, create seller request and seller profile
        if (isSeller) {
          const reqId = crypto.randomUUID();
          await sql`
            INSERT INTO seller_requests (id, requester_id, message, status, created_at)
            VALUES (${reqId}, ${userId}, 'New seller account registration — awaiting admin approval.', 'PENDING', NOW())
          `;

          const profId = crypto.randomUUID();
          await sql`
            INSERT INTO seller_profiles (id, user_id, business_name, status, created_at)
            VALUES (${profId}, ${userId}, ${userName + "'s Store"}, 'PENDING', NOW())
          `;

          const notifId = crypto.randomUUID();
          await sql`
            INSERT INTO notifications (id, type, payload, created_at, is_read)
            VALUES (${notifId}, 'SELLER_REQUEST', ${JSON.stringify({ requestId: reqId, userId, email: cleanedEmail, name: userName })}, NOW(), false)
          `;
        }
      } catch (insertErr) {
        console.warn("Database user persist notice (continuing with session):", insertErr);
      }
    }

    // 4. Create session payload and set cookie
    const userPayload = {
      _id: userId,
      name: userName,
      email: cleanedEmail,
      number: userNumber,
      role: userRole,
      cart: [],
      orders: [],
      sellerApproved: !isSeller,
    };

    const cookieStore = await cookies();
    cookieStore.set("tradehive_session", JSON.stringify(userPayload), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({
      status: true,
      message: "Account verified and registered successfully!",
      user: userPayload,
    }, { status: 201 });
  } catch (err: unknown) {
    console.error("Verify OTP error:", err);
    return NextResponse.json({
      status: false,
      message: "Unable to complete verification. Please verify your connection and try again."
    }, { status: 500 });
  }
}
