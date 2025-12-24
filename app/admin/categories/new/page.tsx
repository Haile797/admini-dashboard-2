// app/admin/categories/new/page.tsx
import CategoryForm from "@/components/admin/categories/CategoryForm";

export default function NewCategoryPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Tạo danh mục mới</h1>
      <CategoryForm />
    </div>
  );
}
