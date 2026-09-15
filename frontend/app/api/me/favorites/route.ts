import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([]);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  return NextResponse.json({ status: true, ...body });
}
