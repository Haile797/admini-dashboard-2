"use client";

import Link from "next/link";

type CategoryRow = {
  id: string;
  name: string;
  _count: {
    products: number;
  };
};

export default function CategoriesTable({
  categories,
}: {
  categories: CategoryRow[];
}) {
  async function deleteCategory(id: string) {
    if (!confirm("Xóa danh mục này?")) return;

    const res = await fetch(`/api/categories/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      alert("Không thể xóa: " + (data?.error ?? res.statusText));
      return;
    }

    location.reload();
  }

  return (
    <div className="bg-card border rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-3 text-left">Tên</th>
            <th className="p-3 text-center">Số sản phẩm</th>
            <th className="p-3 text-right">Hành động</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((c) => (
            <tr key={c.id} className="border-t">
              <td className="p-3">{c.name}</td>
              <td className="p-3 text-center">{c._count.products}</td>

              <td className="p-3 text-right space-x-2">
                <Link
                  href={`/admin/categories/${c.id}/edit`}
                  className="px-3 py-1 border rounded hover:bg-gray-50"
                >
                  Sửa
                </Link>

                <button
                  onClick={() => deleteCategory(c.id)}
                  className="px-3 py-1 border rounded text-red-600"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}

          {categories.length === 0 && (
            <tr>
              <td colSpan={3} className="p-6 text-center text-muted-foreground">
                Chưa có danh mục
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
