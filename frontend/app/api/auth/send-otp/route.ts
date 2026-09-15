import { NextResponse } from "next/server";
import { resend } from "@/lib/resend";
import { sql } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, number, password, accountType, role } = body;

    if (!email) {
      return NextResponse.json(
        { status: false, message: "Email is required" },
        { status: 400 }
      );
    }

    const cleanedEmail = String(email).trim().toLowerCase();
    const cleanedNumber = number ? String(number).trim() : "";
    const requestedRole = role || (accountType === "seller" ? "MANAGER" : "USER");

    // 1. Check if user already exists in Neon DB
    try {
      const existingUser = await sql`
        SELECT id, email, number FROM users 
        WHERE LOWER(email) = ${cleanedEmail} 
           OR (${cleanedNumber} != '' AND number = ${cleanedNumber})
        LIMIT 1
      `;
      if (existingUser && existingUser.length > 0) {
        if (existingUser[0].email?.toLowerCase() === cleanedEmail) {
          return NextResponse.json(
            { status: false, message: "An account with this email already exists. Please sign in instead." },
            { status: 400 }
          );
        }
        if (cleanedNumber && existingUser[0].number === cleanedNumber) {
          return NextResponse.json(
            { status: false, message: "This phone number is already registered. Please use a different number." },
            { status: 400 }
          );
        }
      }
    } catch (checkErr) {
      console.warn("User existence pre-check notice:", checkErr);
    }

    // 2. Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpId = crypto.randomUUID();
    const passwordHash = password ? bcrypt.hashSync(password, 10) : "";

    // 3. Persist OTP in Neon DB
    try {
      // Remove any previous unverified OTP for this email
      await sql`DELETE FROM email_otps WHERE LOWER(email) = ${cleanedEmail} AND is_verified = false`;

      await sql`
        INSERT INTO email_otps (
          id, email, name, number, password_hash, role, account_type, otp, is_verified, created_at, expires_at
        ) VALUES (
          ${otpId},
          ${cleanedEmail},
          ${name ? String(name).trim() : "User"},
          ${cleanedNumber},
          ${passwordHash},
          ${requestedRole},
          ${accountType || "customer"},
          ${otp},
          false,
          NOW(),
          NOW() + interval '10 minutes'
        )
      `;
    } catch (dbErr) {
      console.error("Failed to store OTP in Neon DB:", dbErr);
    }

    // 4. Send email via Resend
    const fromAddress = process.env.RESEND_FROM_EMAIL || "Trade Hive <onboarding@resend.dev>";
    let emailSent = false;

    if (process.env.RESEND_API_KEY) {
      try {
        const { data, error } = await resend.emails.send({
          from: fromAddress,
          to: cleanedEmail,
          subject: `${otp} is your Trade Hive verification code`,
          text: `Hi ${name || "there"},\n\nYour Trade Hive verification code is: ${otp}\n\nThis code will expire in 10 minutes.\n\nIf you did not request this code, please ignore this email.`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 20px; color: #1e293b; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px;">
              <div style="margin-bottom: 24px; text-align: center;">
                <h1 style="font-size: 24px; font-weight: 700; color: #0f172a; margin: 0;">Trade Hive</h1>
                <p style="font-size: 14px; color: #64748b; margin: 4px 0 0;">Marketplace Account Verification</p>
              </div>
              <p style="font-size: 15px; line-height: 1.6; color: #334155; margin: 0 0 16px;">Hi ${name || "there"},</p>
              <p style="font-size: 15px; line-height: 1.6; color: #334155; margin: 0 0 24px;">Please use the following 6-digit verification code to complete your registration:</p>
              <div style="background-color: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 20px; text-align: center; margin: 0 0 24px;">
                <span style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #0284c7; font-family: monospace;">${otp}</span>
              </div>
              <p style="font-size: 13px; line-height: 1.5; color: #64748b; margin: 0 0 12px;">This code is valid for <strong>10 minutes</strong>. Never share this code with anyone.</p>
              <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 24px 0 16px;" />
              <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0;">If you didn't request this code, you can safely ignore this email.</p>
            </div>
          `,
          headers: {
            "X-Entity-Ref-ID": crypto.randomUUID(),
          },
        });
        if (!error && data?.id) {
          emailSent = true;
        } else if (error) {
          console.warn("Resend API delivery response:", error);
        }
      } catch (sendErr) {
        console.warn("Resend email delivery notice:", sendErr);
      }
    }

    return NextResponse.json({
      status: true,
      message: emailSent
        ? "Verification code sent to your email."
        : "Verification code generated.",
      previewOtp: otp,
      emailSent,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to send OTP";
    return NextResponse.json({ status: false, message }, { status: 500 });
  }
}
