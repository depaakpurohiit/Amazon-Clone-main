import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const { searchParams } = new URL(request.url);
  const qty = searchParams.get("qty") || "1";

  return NextResponse.json({
    status: true,
    message: "Cart item quantity updated",
    cartItemId: id,
    qty: parseInt(qty, 10),
  });
}
