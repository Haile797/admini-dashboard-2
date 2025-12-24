// components/admin/dashboard/StatsCards.tsx
"use client";

import React from "react";

type StatusCounts = {
  pending: number;
  completed: number;
  cancelled: number;
};

type Props = {
  revenue: number;
  totalOrders: number;
  ordersByStatus: StatusCounts;
};

export default function StatsCards({ revenue, totalOrders, ordersByStatus }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="p-6 bg-white border rounded-lg shadow-sm">
        <h3 className="text-sm font-medium text-muted-foreground">Doanh thu tháng</h3>
        <p className="mt-4 text-2xl font-bold text-emerald-700">
          {revenue.toLocaleString("vi-VN")} ₫
        </p>
        <p className="text-sm text-muted-foreground mt-1">Chỉ tính đơn đã hoàn thành</p>
      </div>

      <div className="p-6 bg-white border rounded-lg shadow-sm">
        <h3 className="text-sm font-medium text-muted-foreground">Tổng đơn hàng</h3>
        <p className="mt-4 text-2xl font-bold">{totalOrders}</p>
      </div>

      <div className="p-6 bg-white border rounded-lg shadow-sm">
        <h3 className="text-sm font-medium text-muted-foreground">Trạng thái đơn</h3>
        <div className="mt-4 space-y-2 text-sm">
          <div>Đang xử lý: <strong>{ordersByStatus.pending}</strong></div>
          <div>Hoàn thành: <strong>{ordersByStatus.completed}</strong></div>
          <div>Đã hủy: <strong>{ordersByStatus.cancelled}</strong></div>
        </div>
      </div>
    </div>
  );
}
