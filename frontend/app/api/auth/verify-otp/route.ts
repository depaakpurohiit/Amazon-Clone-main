import { NextResponse } from "next/server";

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

    return NextResponse.json({
      status: true,
      message: "OTP verified successfully",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to verify OTP";
    return NextResponse.json({ status: false, message }, { status: 500 });
  }
}
