import { ProductForm } from "@/components/admin/products/ProductForm";

export default function NewProductPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Thêm sản phẩm mới</h1>
      <ProductForm />
    </div>
  );
}