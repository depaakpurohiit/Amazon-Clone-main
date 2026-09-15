import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;
    // In standalone/demo mode, return successful mock login
    return NextResponse.json({
      status: true,
      message: "Logged in successfully",
      user: {
        _id: "demo-user-1",
        email: email || "demo@example.com",
        name: email ? email.split("@")[0] : "Demo User",
        number: "9876543210",
        cart: [],
        orders: [],
        role: "USER",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Login failed";
    return NextResponse.json({ status: false, message }, { status: 500 });
  }
}
