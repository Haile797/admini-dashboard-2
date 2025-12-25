import { prisma } from "@/lib/prisma";
import ProductTable from "@/components/admin/products/ProductTable";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    where: { deletedAt: null },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Quản lý sản phẩm</h1>

      <ProductTable products={products} />
    </div>
  );
}
