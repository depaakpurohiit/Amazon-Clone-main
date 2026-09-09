import { Resend } from "resend";

export const resend = new Resend(
  process.env.RESEND_API_KEY
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
  return await resend.emails.send({
    from,
    to,
    subject,
    html,
  });
}
