"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type OrderItem = {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  _count: {
    orderItems: number;
  };
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  pages: number;
};

type QueryValue = string | number | null | undefined;

export default function OrdersTable({
  initialItems,
  pagination,
}: {
  initialItems: OrderItem[];
  pagination: Pagination;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // filters
  const [status, setStatus] = useState(searchParams.get("status") ?? "");
  const [q, setQ] = useState(searchParams.get("q") ?? "");

  // Helpers -------------------------------------------------
  function updateURL(params: Record<string, QueryValue>) {
    const sp = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      if (value === "" || value == null) sp.delete(key);
      else sp.set(key, String(value));
    });

    router.push(`/admin/orders?${sp.toString()}`);
  }

  function handleSearch() {
    updateURL({ q, page: 1 });
  }

  function handleFilterStatus(newStatus: string) {
    setStatus(newStatus);
    updateURL({ status: newStatus, page: 1 });
  }

  function gotoPage(p: number) {
    updateURL({ page: p });
  }

  // Render --------------------------------------------------
  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-4 items-center">
        <select
          value={status}
          onChange={(e) => handleFilterStatus(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="pending">Đang xử lý</option>
          <option value="completed">Hoàn thành</option>
          <option value="cancelled">Đã huỷ</option>
        </select>

        <input
          type="text"
          placeholder="Tìm theo tên/email khách..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="border p-2 rounded w-60"
        />
        <Button onClick={handleSearch}>Tìm kiếm</Button>
      </div>

      {/* Table */}
      <div className="rounded border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã đơn</TableHead>
              <TableHead>Khách hàng</TableHead>
              <TableHead>Tổng tiền</TableHead>
              <TableHead>Số sản phẩm</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {initialItems.map((order) => (
              <TableRow key={order.id} data-testid="order-row">
                <TableCell className="font-medium">{order.id}</TableCell>

                <TableCell>
                  <div className="font-medium">{order.user.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {order.user.email}
                  </div>
                </TableCell>

                <TableCell>
                  {order.total.toLocaleString("vi-VN")} ₫
                </TableCell>

                <TableCell>{order._count.orderItems}</TableCell>

                <TableCell>
                  <Badge
                    variant={
                      order.status === "completed"
                        ? "default"
                        : order.status === "cancelled"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {order.status === "pending"
                      ? "Đang xử lý"
                      : order.status === "completed"
                      ? "Hoàn thành"
                      : "Đã huỷ"}
                  </Badge>
                </TableCell>

                <TableCell>
                  {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                </TableCell>

                <TableCell className="text-right">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/orders/${order.id}`}>Xem</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 py-4">
        <Button
          variant="outline"
          disabled={pagination.page <= 1}
          onClick={() => gotoPage(pagination.page - 1)}
        >
          Trang trước
        </Button>

        <span>
          Trang {pagination.page} / {pagination.pages}
        </span>

        <Button
          variant="outline"
          disabled={pagination.page >= pagination.pages}
          onClick={() => gotoPage(pagination.page + 1)}
        >
          Trang sau
        </Button>
      </div>
    </div>
  );
}
