import { NextResponse } from "next/server";
import { resend } from "@/lib/resend";

export async function GET() {
  try {
    const data = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "aman.23jics029@jietjodhpur.ac.in",
      subject: "Hello World",
      html: "<p>Congrats on sending your <strong>first email</strong>!</p>",
    });

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || error },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { to, subject, html } = body;

    const data = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: to || "aman.23jics029@jietjodhpur.ac.in",
      subject: subject || "Hello World",
      html: html || "<p>Congrats on sending your <strong>first email</strong>!</p>",
    });

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || error },
      { status: 500 }
    );
  }
}
