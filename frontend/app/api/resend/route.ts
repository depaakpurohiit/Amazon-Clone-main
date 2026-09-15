import { NextResponse } from "next/server";
import { getResendClient } from "@/lib/resend";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const client = getResendClient();
    if (!client) {
      return NextResponse.json(
        { success: false, error: "RESEND_API_KEY environment variable is not configured." },
        { status: 500 }
      );
    }

    const data = await client.emails.send({
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
    const client = getResendClient();
    if (!client) {
      return NextResponse.json(
        { success: false, error: "RESEND_API_KEY environment variable is not configured." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { to, subject, html } = body;

    const data = await client.emails.send({
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
