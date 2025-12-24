"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

type DeleteButtonProps = {
  id: string;
};

export default function DeleteButton({ id }: DeleteButtonProps) {
  const handleDelete = async () => {
    if (!confirm("Xóa sản phẩm này?")) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Xóa thất bại");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Xóa sản phẩm thất bại");
    }
  };

  return (
    <Button
      size="icon"
      variant="ghost"
      className="text-red-600 hover:bg-red-50"
      onClick={handleDelete}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
