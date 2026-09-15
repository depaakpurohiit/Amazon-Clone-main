import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { status: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Query user in Neon PostgreSQL
    let userRecord: any = null;
    try {
      const rows = await sql`SELECT * FROM users WHERE LOWER(email) = ${trimmedEmail} LIMIT 1`;
      if (rows && rows.length > 0) {
        userRecord = rows[0];
      }
    } catch (dbErr) {
      console.error("Neon user lookup error:", dbErr);
    }

    let isValid = false;

    // Direct check for admin credentials
    if (trimmedEmail === "mainadmin@@1212" && password === "adminadmin@@") {
      isValid = true;
      if (!userRecord) {
        userRecord = {
          id: "a51f256d-6d1a-4670-b810-b9dc749ae531",
          email: "mainadmin@@1212",
          name: "Main Admin",
          number: "463807f9-0",
          role: "ADMIN",
        };
      }
    } else if (userRecord && userRecord.password) {
      // Check bcrypt password
      isValid = bcrypt.compareSync(password, userRecord.password);
      if (!isValid && password === userRecord.password) {
        isValid = true;
      }
    }

    if (!isValid) {
      return NextResponse.json(
        { status: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const userPayload = {
      _id: String(userRecord.id),
      name: userRecord.name || trimmedEmail.split("@")[0],
      email: userRecord.email || trimmedEmail,
      number: userRecord.number || "",
      role: userRecord.role || "USER",
      cart: [],
      orders: [],
      sellerApproved: userRecord.seller_approved || userRecord.role === "MANAGER" || userRecord.role === "ADMIN",
    };

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set("tradehive_session", JSON.stringify(userPayload), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({
      status: true,
      message: "Logged in successfully",
      user: userPayload,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Login failed";
    return NextResponse.json({ status: false, message }, { status: 500 });
  }
}
