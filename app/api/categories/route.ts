import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";

const CategorySchema = z.object({
  name: z.string().min(2, "Tên danh mục tối thiểu 2 ký tự"),
});

// ====================== GET ======================
export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(categories);
}

// ====================== POST ======================
export async function POST(req: Request) {
  try {
    // 🔒 RBAC
    await requireAdmin();

    const body = await req.json();
    const data = CategorySchema.parse(body);

    const category = await prisma.category.create({
      data,
    });

    return NextResponse.json(category, { status: 201 });
  } catch (err) {
    if ((err as Error).message === "UNAUTHORIZED") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    if ((err as Error).message === "FORBIDDEN") {
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
      );
    }

    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.issues },
        { status: 422 }
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
