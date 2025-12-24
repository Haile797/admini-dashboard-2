import { prisma } from "@/lib/prisma";
import CategoryForm from "@/components/admin/categories/CategoryForm";

export default async function EditCategoryPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    return <div className="p-8">Không tìm thấy danh mục</div>;
  }

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Sửa danh mục</h1>

      <CategoryForm initialCategory={category} />
    </div>
  );
}
