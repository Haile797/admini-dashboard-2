"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";

const CategorySchema = z.object({
  name: z.string().min(2, "Tên danh mục phải có ít nhất 2 ký tự"),
});

type Category = {
  id: string;
  name: string;
};

export default function CategoryForm({
  initialCategory,
}: {
  initialCategory?: Category;
}) {
  const router = useRouter();
  const [name, setName] = useState(initialCategory?.name ?? "");
  const [loading, setLoading] = useState(false);
  const isEdit = Boolean(initialCategory);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate
      CategorySchema.parse({ name });

      const body = JSON.stringify({ name });
      const url = isEdit
        ? `/api/categories/${initialCategory!.id}`
        : `/api/categories`;

      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body,
      });

      if (!res.ok) {
        const json = await res.json();
        alert("Lỗi: " + (json?.error || res.statusText));
        return;
      }

      router.push("/admin/categories");
      router.refresh();
    } catch (err) {
      if (err instanceof z.ZodError) {
        alert(err.issues[0].message);
      } else {
        alert("Đã xảy ra lỗi!");
      }
    }

    setLoading(false);
  }

  async function handleDelete() {
    if (!isEdit) return;

    if (!confirm("Bạn chắc chắn muốn xóa danh mục này?")) return;

    setLoading(true);

    const res = await fetch(`/api/categories/${initialCategory!.id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const json = await res.json();
      alert("Không thể xóa: " + (json?.error || res.statusText));
      return;
    }

    router.push("/admin/categories");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <div>
        <label className="block text-sm font-medium mb-1">
          Tên danh mục
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="Ví dụ: Laptop"
        />
      </div>

      <div className="flex gap-3">
        <button
          disabled={loading}
          className="px-4 py-2 bg-sky-600 text-white rounded disabled:opacity-50"
        >
          {isEdit ? "Lưu thay đổi" : "Tạo danh mục"}
        </button>

        {isEdit && (
          <button
            type="button"
            disabled={loading}
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-50"
          >
            Xóa
          </button>
        )}
      </div>
    </form>
  );
}
