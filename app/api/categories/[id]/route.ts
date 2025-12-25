import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const UpdateCategorySchema = z.object({
  name: z.string().min(2),
});

export async function PATCH(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;
    const body = await req.json();
    const parsed = UpdateCategorySchema.parse(body);

    const updated = await prisma.category.update({
      where: { id },
      data: parsed,
    });

    return NextResponse.json(updated);
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 422 });
    }

    return NextResponse.json(
      { error: "Không thể cập nhật danh mục" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;

    const hasProducts = await prisma.product.count({
      where: { categoryId: id },
    });

    if (hasProducts > 0) {
      return NextResponse.json(
        { error: "Không thể xóa danh mục đang chứa sản phẩm" },
        { status: 400 }
      );
    }

    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Xóa thất bại" }, { status: 500 });
  }
}
