import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const products = await prisma.product.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const data = await request.json();
  const product = await prisma.product.create({ data });
  return NextResponse.json(product, { status: 201 });
}