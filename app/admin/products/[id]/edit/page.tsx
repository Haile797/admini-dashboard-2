import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/products/ProductForm";
import { notFound } from "next/navigation";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findFirst({
    where: { id: params.id, deletedAt: null },
  });

  if (!product) notFound();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Chỉnh sửa sản phẩm</h1>
      <ProductForm product={product} />
    </div>
  );
}