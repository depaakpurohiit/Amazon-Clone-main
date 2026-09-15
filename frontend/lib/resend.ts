import { Resend } from "resend";

export function getResendClient(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return null;
  }
  return new Resend(key);
}

// Fallback dummy key to prevent build-time crashes when RESEND_API_KEY is not set yet in deployment env
export const resend = new Resend(
  process.env.RESEND_API_KEY || "re_build_placeholder_key"
);

export async function sendEmail({
  from = "onboarding@resend.dev",
  to = "aman.23jics029@jietjodhpur.ac.in",
  subject = "Hello World",
  html = "<p>Congrats on sending your <strong>first email</strong>!</p>",
}: {
  from?: string;
  to: string | string[];
  subject: string;
  html: string;
}) {
  const client = getResendClient();
  if (!client) {
    throw new Error("RESEND_API_KEY is not configured in environment variables.");
  }
  return await client.emails.send({
    from,
    to,
    subject,
    html,
  });
}
