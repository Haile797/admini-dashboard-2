import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/* =======================
   Schema
======================= */
const ProductSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional().nullable(),
  price: z.number().positive(),
  status: z.enum(["ACTIVE", "DRAFT"]).default("DRAFT"),
  categoryId: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
});

/* =======================
   Helpers
======================= */
async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  if (session.user.role?.toLowerCase() !== "admin") {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  return null;
}

/* =======================
   GET /api/products
   ✔ Logged-in users (admin + staff)
======================= */
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 10);
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null };

    const categoryId = searchParams.get("categoryId");
    const status = searchParams.get("status");
    const q = searchParams.get("q");

    if (categoryId) where.categoryId = categoryId;
    if (status) where.status = status;
    if (q) where.name = { contains: q, mode: "insensitive" };

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          price: true,
          status: true,
          imageUrl: true,
          category: { select: { id: true, name: true } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.max(1, Math.ceil(total / limit)),
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

/* =======================
   POST /api/products
   ✔ Admin only
======================= */
export async function POST(req: Request) {
  const adminError = await requireAdmin();
  if (adminError) return adminError;

  try {
    const json = await req.json();
    const parsed = ProductSchema.parse(json);

    const product = await prisma.product.create({
      data: parsed,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.issues },
        { status: 422 }
      );
    }

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
