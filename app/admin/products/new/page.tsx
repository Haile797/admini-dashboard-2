import ProductForm from "@/components/admin/products/ProductForm";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany();

  async function createProduct(data: any) {
    "use server";

    await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    redirect("/admin/products");
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Thêm sản phẩm mới</h1>
      <ProductForm
         categories={categories} />
    </div>
  );
}
