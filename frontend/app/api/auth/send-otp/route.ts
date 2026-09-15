import { NextResponse } from "next/server";
import { resend } from "@/lib/resend";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name } = body;
    if (!email) {
      return NextResponse.json(
        { status: false, message: "Email is required" },
        { status: 400 }
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const fromAddress = process.env.RESEND_FROM_EMAIL || "Trade Hive <onboarding@resend.dev>";

    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: fromAddress,
          to: email,
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
      } catch (err) {
        console.warn("Resend email delivery notice:", err);
      }
    }

    return NextResponse.json({
      status: true,
      message: "Verification code sent to your email.",
      previewOtp: process.env.NODE_ENV !== "production" ? otp : undefined,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to send OTP";
    return NextResponse.json({ status: false, message }, { status: 500 });
  }
}
