"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import type { Product, Category } from "@prisma/client";

const ProductSchema = z.object({
  name: z.string().min(2, "Tên sản phẩm quá ngắn"),
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
  product?: Product | null;
  categories: Category[];
}) {
  const router = useRouter();

  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product?.price ?? 0);
  const [status, setStatus] = useState<"ACTIVE" | "DRAFT">(
    (product?.status as any) ?? "DRAFT"
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

  // Upload ảnh
  async function handleUpload(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const json = await res.json();
    setUploading(false);

    if (!json.url) return alert("Upload ảnh thất bại");

    setImageUrl(json.url);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
      {/* Tên */}
      <div>
        <label className="block mb-1 font-medium">Tên sản phẩm</label>
        <input
          data-testid="product-name"
          className="w-full border rounded px-3 py-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* Mô tả */}
      <div>
        <label className="block mb-1 font-medium">Mô tả</label>
        <textarea
          className="w-full border rounded px-3 py-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Giá */}
      <div>
        <label className="block mb-1 font-medium">Giá (VND)</label>
        <input
          data-testid="product-price"
          type="number"
          className="w-full border rounded px-3 py-2"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />
      </div>

      {/* Trạng thái */}
      <div>
        <label className="block mb-1 font-medium">Trạng thái</label>
        <select
           data-testid="product-status"
          className="w-full border rounded px-3 py-2"
          value={status}
          onChange={(e) => setStatus(e.target.value as "ACTIVE" | "DRAFT")}
        >
          <option value="ACTIVE">ACTIVE</option>
          <option value="DRAFT">DRAFT</option>
        </select>
      </div>

      {/* Danh mục */}
      <div>
        <label className="block mb-1 font-medium">Danh mục</label>
        <select
          data-testid="product-category"
          className="w-full border rounded px-3 py-2"
          value={categoryId ?? ""}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">-- Chọn danh mục --</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Ảnh */}
      <div>
        <label className="block mb-1 font-medium">Ảnh sản phẩm</label>

        {imageUrl && (
          <img
            src={imageUrl}
            className="w-32 h-32 object-cover border rounded mb-2"
          />
        )}

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleUpload(f);
          }}
        />

        {uploading && <p>Đang tải ảnh...</p>}
      </div>

      {/* Submit */}
      <button
         data-testid="product-submit"
         className="px-4 py-2 bg-blue-600 text-white rounded">
         {product ? "Lưu thay đổi" : "Tạo sản phẩm"}
      </button>
    </form>
  );
}
