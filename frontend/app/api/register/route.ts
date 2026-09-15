import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({
      status: true,
      message: "User registered successfully",
      user: {
        _id: "demo-user-1",
        email: body.email,
        name: body.name,
        number: body.number,
        cart: [],
        orders: [],
        role: body.role || "USER",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Registration failed";
    return NextResponse.json({ status: false, message }, { status: 500 });
  }
}
