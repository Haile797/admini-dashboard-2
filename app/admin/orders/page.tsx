import OrdersTable from "@/components/admin/orders/OrdersTable";
import { prisma } from "@/lib/prisma";
import { parseISO } from "date-fns";

type SearchParams = {
  page?: string;
  limit?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  q?: string;
};

export const dynamic = "force-dynamic";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  // 🔥 FIX QUAN TRỌNG: searchParams là Promise → phải await
  const params = await searchParams;

  const page = Number(params.page ?? 1);
  const limit = Number(params.limit ?? 10);
  const skip = (page - 1) * limit;

  const where: any = {};

  // Lọc theo trạng thái
  if (params.status) {
    where.status = params.status.toLowerCase();
  }

  // Lọc ngày
  if (params.dateFrom || params.dateTo) {
    where.createdAt = {};
    if (params.dateFrom) {
      const d = parseISO(params.dateFrom);
      if (!isNaN(d.getTime())) where.createdAt.gte = d;
    }
    if (params.dateTo) {
      const d = parseISO(params.dateTo);
      if (!isNaN(d.getTime())) where.createdAt.lte = d;
    }
  }

  // Tìm kiếm tên hoặc email user
  if (params.q) {
    where.user = {
      OR: [
        { name: { contains: params.q, mode: "insensitive" } },
        { email: { contains: params.q, mode: "insensitive" } },
      ],
    };
  }

  // Query danh sách order
  const [rawItems, total] = await Promise.all([
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
        user: { select: { id: true, name: true, email: true } },
        _count: { select: { orderItems: true } },
      },
    }),
    prisma.order.count({ where }),
  ]);

  // Convert Date → string (cho client component)
  const items = rawItems.map((o) => ({
    ...o,
    createdAt: o.createdAt.toISOString(),
  }));

  const pagination = {
    page,
    limit,
    total,
    pages: Math.max(1, Math.ceil(total / limit)),
  };

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Quản lý đơn hàng</h1>

      <OrdersTable initialItems={items} pagination={pagination} />
    </div>
  );
}
