import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  // Doanh thu tháng
  const revenue = await prisma.order.aggregate({
    _sum: { total: true },
    where: {
      status: "completed",
      createdAt: { gte: monthStart },
    },
  });

  // Đếm đơn theo trạng thái
  const totalOrders = await prisma.order.count();
  const pending = await prisma.order.count({ where: { status: "pending" } });
  const completed = await prisma.order.count({ where: { status: "completed" } });
  const cancelled = await prisma.order.count({ where: { status: "cancelled" } });

  return NextResponse.json({
    totalOrders,
    pending,
    completed,
    cancelled,
    revenue: revenue._sum.total || 0,
  });
}
