import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  cookieStore.delete("tradehive_session");

  return NextResponse.json({
    status: true,
    message: "Logged out successfully",
  });
}
