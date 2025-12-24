"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function OrdersFilters() {
  const router = useRouter();
  const params = useSearchParams();

  const [status, setStatus] = useState(params.get("status") || "");
  const [dateFrom, setDateFrom] = useState(params.get("dateFrom") || "");
  const [dateTo, setDateTo] = useState(params.get("dateTo") || "");
  const [q, setQ] = useState(params.get("q") || "");

  const applyFilters = () => {
    const search = new URLSearchParams();

    if (status) search.set("status", status);
    if (dateFrom) search.set("dateFrom", dateFrom);
    if (dateTo) search.set("dateTo", dateTo);
    if (q) search.set("q", q);

    router.push(`/admin/orders?${search.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-4 p-4 bg-white border rounded-lg">
      {/* Trạng thái */}
      <select
        className="border p-2 rounded"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="">Tất cả trạng thái</option>
        <option value="pending">Đang xử lý</option>
        <option value="completed">Hoàn thành</option>
        <option value="cancelled">Đã hủy</option>
      </select>

      {/* Từ ngày */}
      <input
        type="date"
        className="border p-2 rounded"
        value={dateFrom}
        onChange={(e) => setDateFrom(e.target.value)}
      />

      {/* Đến ngày */}
      <input
        type="date"
        className="border p-2 rounded"
        value={dateTo}
        onChange={(e) => setDateTo(e.target.value)}
      />

      {/* Search */}
      <input
        type="text"
        className="border p-2 rounded"
        placeholder="Tìm theo user/email..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      {/* Apply */}
      <button
        onClick={applyFilters}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Lọc
      </button>
    </div>
  );
}
