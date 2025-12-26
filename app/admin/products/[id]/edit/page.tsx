import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/products/ProductForm";
import type { ProductDTO } from "@/components/admin/products/types";

export default async function EditProductPage(
  props: { params: Promise<{ id: string }> }
) {
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

  // ✅ MAP Prisma Product → ProductDTO (FIX CHUẨN)
  const productDTO: ProductDTO = {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    imageUrl: product.imageUrl,
    categoryId: product.categoryId,
    status:
      product.status === "ACTIVE" || product.status === "DRAFT"
        ? product.status
        : "DRAFT",
  };

  return (
    <ProductForm
      product={productDTO}
      categories={categories}
    />
  );
}
