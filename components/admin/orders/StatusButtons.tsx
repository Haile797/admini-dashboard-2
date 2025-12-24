"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  orderId: string;
  currentStatus: string;
};

export default function StatusButtons({ orderId, currentStatus }: Props) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(currentStatus);

  async function updateStatus(newStatus: string) {
    setLoading(true);

    const res = await fetch(`/api/orders/${orderId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    setLoading(false);

    if (!res.ok) {
      alert("Lỗi khi cập nhật trạng thái!");
      return;
    }

    setStatus(newStatus);
  }

  return (
    <div className="flex gap-3 mt-3">
      <Button
        disabled={loading || status === "pending"}
        onClick={() => updateStatus("pending")}
      >
        Đang xử lý
      </Button>

      <Button
        disabled={loading || status === "completed"}
        onClick={() => updateStatus("completed")}
      >
        Hoàn thành
      </Button>

      <Button
        variant="destructive"
        disabled={loading || status === "cancelled"}
        onClick={() => updateStatus("cancelled")}
      >
        Hủy đơn
      </Button>
    </div>
  );
}
