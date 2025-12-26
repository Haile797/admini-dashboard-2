"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";

type ProductDTO = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  status: "ACTIVE" | "DRAFT";
  categoryId?: string | null;
  imageUrl?: string | null;
};

type CategoryDTO = {
  id: string;
  name: string;
};

const ProductSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.coerce.number().min(0),
  status: z.enum(["ACTIVE", "DRAFT"]),
  categoryId: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
});

export default function ProductForm({
  product,
  categories,
}: {
  product?: ProductDTO | null;
  categories: CategoryDTO[];
}) {
  const router = useRouter();

  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product?.price ?? 0);
  const [status, setStatus] = useState<"ACTIVE" | "DRAFT">(
    product?.status ?? "DRAFT"
  );
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? "");
  const [imageUrl, setImageUrl] = useState(product?.imageUrl ?? "");
  const [uploading, setUploading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const parsed = ProductSchema.safeParse({
      name,
      description,
      price,
      status,
      categoryId,
      imageUrl,
    });

    if (!parsed.success) {
      alert(parsed.error.issues[0].message);
      return;
    }

    const url = product ? `/api/products/${product.id}` : `/api/products`;
    const method = product ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });

    if (!res.ok) {
      const json = await res.json();
      alert(json.error || "Lỗi server");
      return;
    }

    router.push("/admin/products");
    router.refresh();
  }

  async function handleUpload(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const json: { url?: string } = await res.json();
    setUploading(false);

    if (!json.url) {
      alert("Upload ảnh thất bại");
      return;
    }

    setImageUrl(json.url);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
      {/* giữ nguyên JSX của bạn */}
    </form>
  );
}
