import { prisma } from "@/lib/prisma";
import CategoriesTable from "@/components/admin/categories/CategoriesTable";
import Link from "next/link";

export const revalidate = 0;

export default async function CategoriesPage() {
  const cats = await prisma.category.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Quản lý danh mục</h1>
        <Link
          href="/admin/categories/new"
          className="inline-flex items-center px-4 py-2 bg-sky-600 text-white rounded"
        >
          + Thêm danh mục
        </Link>
      </div>

      <CategoriesTable categories={cats} />
    </div>
  );
}
