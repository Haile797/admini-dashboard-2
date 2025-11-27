// app/api/products/[id]/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const PATCH = async (req: Request, { params }: { params: { id: string } }) => {
  const data = await req.json();
  const product = await prisma.product.update({
    where: { id: params.id },
    data,
  });
  return NextResponse.json(product);
};

export const DELETE = async (req: Request, { params }: { params: { id: string } }) => {
  await prisma.product.update({
    where: { id: params.id },
    data: { deletedAt: new Date() },
  });
  return NextResponse.json({ success: true });
};