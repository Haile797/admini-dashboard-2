// app/api/orders/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const QuerySchema = z.object({
  page: z.preprocess((v) => Number(v), z.number().min(1).default(1)),
  limit: z.preprocess((v) => Number(v), z.number().min(1).max(100).default(10)),
  status: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  q: z.string().optional(), // search by user name or email
});

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const parsed = QuerySchema.parse({
      page: url.searchParams.get("page"),
      limit: url.searchParams.get("limit"),
      status: url.searchParams.get("status"),
      dateFrom: url.searchParams.get("dateFrom"),
      dateTo: url.searchParams.get("dateTo"),
      q: url.searchParams.get("q"),
    });

    const { page, limit, status, dateFrom, dateTo, q } = parsed;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status) {
      // normalize accept lowercase/uppercase
      where.status = { equals: status.toLowerCase() === status ? status : status.toLowerCase() } ;
      // we store whatever in DB; the point is to filter; adjust if you standardize status.
    }

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom);
      if (dateTo) where.createdAt.lte = new Date(dateTo);
    }

    if (q) {
      where.user = {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { email: { contains: q, mode: "insensitive" } },
        ],
      };
    }

    const [items, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          status: true,
          total: true,
          createdAt: true,
          updatedAt: true,
          user: { select: { id: true, name: true, email: true } },
          // don't include orderItems in list for performance
        },
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({
      items,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err: any) {
    console.error("GET /api/orders error:", err);
    return NextResponse.json({ message: err?.message || "Server error" }, { status: 500 });
  }
}
