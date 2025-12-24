import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/products/ProductForm";

export default async function EditProductPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    return <div className="p-8 text-red-500">Sản phẩm không tồn tại</div>;
  }

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return <ProductForm product={product} categories={categories} />;
}
