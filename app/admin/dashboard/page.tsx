// app/admin/dashboard/page.tsx
import { prisma } from "@/lib/prisma";
import StatsCards from "@/components/admin/dashboard/StatsCards";
import RevenueChart from "@/components/admin/dashboard/RevenueChart";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const now = new Date();
  const year = now.getFullYear();

  // 1) Tổng doanh thu tháng hiện tại (chỉ completed)
  const startOfMonth = new Date(year, now.getMonth(), 1);
  const revenueThisMonthAgg = await prisma.order.aggregate({
    where: {
      status: "completed",
      createdAt: { gte: startOfMonth },
    },
    _sum: { total: true },
  });
  const revenueThisMonth = revenueThisMonthAgg._sum.total ?? 0;

  // 2) Tổng đơn hàng
  const totalOrders = await prisma.order.count();

  // 3) Đếm theo trạng thái
  const ordersByStatus = await prisma.order.groupBy({
    by: ["status"],
    _count: { status: true },
  });
  // normalize to object { pending: n, completed: n, cancelled: n }
  const statusCounts = {
    pending: 0,
    completed: 0,
    cancelled: 0,
  };
  for (const r of ordersByStatus) {
    const key = r.status as keyof typeof statusCounts;
    statusCounts[key] = r._count.status;
  }

  // 4) Doanh thu theo tháng trong năm hiện tại (1..12)
  // Use raw SQL to group by month and sum only completed orders in this year.
  // We'll then fill missing months with 0.
  const raw: { month: number; revenue: number }[] = await prisma.$queryRaw`
    SELECT
      EXTRACT(MONTH FROM o."createdAt")::int AS month,
      COALESCE(SUM(o.total),0) AS revenue
    FROM "Order" o
    WHERE o.status = 'completed'
      AND EXTRACT(YEAR FROM o."createdAt") = ${year}
    GROUP BY month
    ORDER BY month
  `;

  // build array of 12 months
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const revenueByMonth = months.map((m) => {
    const found = raw.find((r) => Number(r.month) === m);
    return { month: m, revenue: found ? Number(found.revenue) : 0 };
  });

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Tổng Quan Dashboard</h1>

      <StatsCards
        revenue={revenueThisMonth}
        totalOrders={totalOrders}
        ordersByStatus={statusCounts}
      />

      <RevenueChart data={revenueByMonth} year={year} />
    </div>
  );
}
