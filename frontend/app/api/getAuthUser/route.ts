import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("tradehive_session");

    if (sessionCookie && sessionCookie.value) {
      try {
        const user = JSON.parse(sessionCookie.value);
        return NextResponse.json(user, { status: 200 });
      } catch (parseErr) {
        console.error("Invalid session cookie JSON:", parseErr);
      }
    }

    // Return null with 200 status so unauthenticated visitors load cleanly without console errors
    return NextResponse.json(null, { status: 200 });
  } catch (err) {
    return NextResponse.json(null, { status: 200 });
  }
}
