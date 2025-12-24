import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  // 🔥 FIX: params là Promise → phải await
  const { id } = await context.params;

  const body = await req.json();
  const { status } = body;

  if (!["pending", "completed", "cancelled"].includes(status)) {
    return NextResponse.json(
      { error: "Trạng thái không hợp lệ" },
      { status: 400 }
    );
  }

  try {
    const updated = await prisma.order.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: "Không thể cập nhật trạng thái" },
      { status: 500 }
    );
  }
}
