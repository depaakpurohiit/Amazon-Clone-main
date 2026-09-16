import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sql } from "@/lib/db";

async function getAuthUser() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("tradehive_session");
  if (!sessionCookie?.value) return null;
  try {
    return JSON.parse(sessionCookie.value);
  } catch {
    return null;
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const { id } = await context.params;
    const userId = String(user._id || user.id);

    await sql`
      DELETE FROM favorites 
      WHERE (product_id = ${id} OR id = ${id}) 
        AND user_id = ${userId}
    `;

    return NextResponse.json({ status: true, message: "Removed from favorites" });
  } catch (err: unknown) {
    console.error("DELETE favorite error:", err);
    return NextResponse.json({ error: "Failed to remove favorite" }, { status: 500 });
  }
}
