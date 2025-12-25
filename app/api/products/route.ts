import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import type { Prisma } from "@prisma/client";

const QuerySchema = z.object({
  status: z.string().optional(),
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const parsed = QuerySchema.parse({
    status: url.searchParams.get("status"),
  });

  const where: Prisma.ProductWhereInput = {
    deletedAt: null,
  };

  if (parsed.status) {
    where.status = parsed.status;
  }

  const products = await prisma.product.findMany({
    where,
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products);
}
