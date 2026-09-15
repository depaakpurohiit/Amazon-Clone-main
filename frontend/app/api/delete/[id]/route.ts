import { NextResponse } from "next/server";

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  return NextResponse.json({
    status: true,
    message: "Item removed from cart",
    cartItemId: id,
  });
}
