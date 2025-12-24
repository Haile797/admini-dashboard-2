import { prisma } from "@/lib/prisma";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    where: {
      deletedAt: null,
      status: "ACTIVE",
    },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">
        Danh sách sản phẩm
      </h1>

      {products.length === 0 && (
        <p>Chưa có sản phẩm</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((p) => (
          <div
            key={p.id}
            className="border rounded-lg p-4 space-y-2"
          >
            {p.imageUrl && (
              <img
                src={p.imageUrl}
                className="w-full h-40 object-cover rounded"
              />
            )}

            <h2 className="font-semibold">
              {p.name}
            </h2>

            <p className="text-sm text-muted-foreground">
              {p.category?.name ?? "Uncategorized"}
            </p>

            <p className="font-bold text-green-600">
              {p.price.toLocaleString("vi-VN")} ₫
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
