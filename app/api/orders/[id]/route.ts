// app/api/orders/[id]/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const ParamsSchema = z.object({
  id: z.string().min(1),
});

export async function GET(req: Request, { params }: { params: { id: string } | Promise<{ id: string }> }) {
  try {
    const { id } = typeof params === "object" ? (await params) : params;
    ParamsSchema.parse({ id });

    const order = await prisma.order.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        total: true,
        createdAt: true,
        updatedAt: true,
        user: { select: { id: true, name: true, email: true } },
        orderItems: {
          select: {
            id: true,
            quantity: true,
            price: true,
            product: { select: { id: true, name: true, imageUrl: true } },
          },
        },
      },
    });

    if (!order) return NextResponse.json({ message: "Order not found" }, { status: 404 });

    return NextResponse.json(order);
  } catch (err: any) {
    console.error("GET /api/orders/[id] error:", err);
    return NextResponse.json({ message: err?.message || "Server error" }, { status: 500 });
  }
}
