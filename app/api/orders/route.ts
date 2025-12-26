import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import type { Prisma } from "@prisma/client";

const QuerySchema = z.object({
  page: z.preprocess((v) => Number(v), z.number().default(1)),
  limit: z.preprocess((v) => Number(v), z.number().default(10)),
  status: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  q: z.string().optional(),
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const parsed = QuerySchema.parse({
    page: url.searchParams.get("page"),
    limit: url.searchParams.get("limit"),
    status: url.searchParams.get("status"),
    dateFrom: url.searchParams.get("dateFrom"),
    dateTo: url.searchParams.get("dateTo"),
    q: url.searchParams.get("q"),
  });

  const skip = (parsed.page - 1) * parsed.limit;

  const where = {} as Prisma.OrderWhereInput;

  if (parsed.status) {
    where.status = parsed.status.toLowerCase();
  }

  if (parsed.dateFrom || parsed.dateTo) {
    where.createdAt = {};
    if (parsed.dateFrom) where.createdAt.gte = new Date(parsed.dateFrom);
    if (parsed.dateTo) where.createdAt.lte = new Date(parsed.dateTo);
  }

  if (parsed.q) {
    where.user = {
      OR: [
        { name: { contains: parsed.q, mode: "insensitive" } },
        { email: { contains: parsed.q, mode: "insensitive" } },
      ],
    };
  }

  const [items, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip,
      take: parsed.limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.count({ where }),
  ]);

  return NextResponse.json({
    items,
    pagination: {
      page: parsed.page,
      limit: parsed.limit,
      total,
    },
  });
}
