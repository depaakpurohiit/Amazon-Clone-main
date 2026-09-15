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

    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: "Trade Hive <onboarding@resend.dev>",
          to: email,
          subject: "Your Trade Hive Verification Code",
          html: `<p>Hi ${name || "there"},</p><p>Your verification code is: <strong>${otp}</strong></p><p>This code will expire in 10 minutes.</p>`,
        });
      } catch (err) {
        console.warn("Resend email delivery notice:", err);
      }
    }

    return NextResponse.json({
      status: true,
      message: "Verification code sent",
      previewOtp: process.env.NODE_ENV !== "production" ? otp : undefined,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to send OTP";
    return NextResponse.json({ status: false, message }, { status: 500 });
  }
}
