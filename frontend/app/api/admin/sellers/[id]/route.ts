import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    await sql`DELETE FROM seller_profiles WHERE id = ${id}`;
    return NextResponse.json({ status: "SUCCESS" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Delete failed";
    return NextResponse.json({ status: "FAILED", message }, { status: 500 });
  }
}
