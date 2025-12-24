// components/admin/dashboard/RevenueChart.tsx
"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Bar,
} from "recharts";

type DataPoint = {
  month: number;
  revenue: number;
};

export default function RevenueChart({
  data,
  year,
}: {
  data: DataPoint[];
  year: number;
}) {
  // convert month number -> label
  const chartData = data.map((d) => ({
    ...d,
    monthLabel: `${d.month}/${year}`,
    revenueK: Math.round(d.revenue / 1000), // for scale if needed
  }));

  return (
    <div className="p-6 bg-white border rounded-lg shadow-sm">
      <h3 className="text-lg font-medium mb-4">Doanh thu theo tháng ({year})</h3>

      <div style={{ width: "100%", height: 320 }}>
        <ResponsiveContainer>
          <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="monthLabel" />
            <YAxis tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
            <Tooltip formatter={(value: number) => new Intl.NumberFormat("vi-VN").format(value) + " ₫"} />
            <Bar dataKey="revenue" fill="#0ea5a4" name="Doanh thu" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
