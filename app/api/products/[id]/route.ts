// app/api/products/[id]/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// PATCH - Sửa sản phẩm (sửa kiểu params cho Next.js 16)
export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ← Await params vì là Promise
  const data = await request.json();

  const product = await prisma.product.update({
    where: { id },
    data,
  });

  return NextResponse.json(product);
}

// DELETE - Soft delete (sửa kiểu params cho Next.js 16)
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ← Await params vì là Promise

  await prisma.product.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  return NextResponse.json({ success: true });
}