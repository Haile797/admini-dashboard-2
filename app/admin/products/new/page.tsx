import ProductForm from "@/components/admin/products/ProductForm";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Thêm sản phẩm mới</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
