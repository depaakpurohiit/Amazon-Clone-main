import { NextResponse } from "next/server";

export async function GET() {
  // In demo / unauthenticated state, return 401 so the UI cleanly defaults to guest/unauthenticated
  return NextResponse.json(
    { message: "Unauthenticated" },
    { status: 401 }
  );
}
