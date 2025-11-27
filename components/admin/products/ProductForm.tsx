// components/admin/products/ProductForm.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label"; // ← THÊM DÒNG NÀY

export function ProductForm({ product }: { product?: any }) {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState(product?.imageUrl || "");
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    const payload = { ...data, imageUrl: imageUrl || null };

    const url = product ? `/api/products/${product.id}` : "/api/products";
    const method = product ? "PATCH" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    router.push("/admin/products");
    router.refresh();
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      setImageUrl(json.url);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Label>Hình ảnh sản phẩm</Label>
          {imageUrl ? (
            <img src={imageUrl} alt="preview" className="w-full h-80 object-cover rounded-lg border" />
          ) : (
            <div className="w-full h-80 bg-muted border-2 border-dashed rounded-lg flex items-center justify-center text-muted-foreground">
              Chưa có hình ảnh
            </div>
          )}
          <Input type="file" accept="image/*" onChange={handleUpload} disabled={isUploading} />
          {isUploading && <p className="text-sm text-blue-600">Đang tải lên...</p>}
        </div>

        <div className="space-y-6">
          <div>
            <Label htmlFor="name">Tên sản phẩm</Label>
            <Input id="name" name="name" defaultValue={product?.name} required />
          </div>
          <div>
            <Label htmlFor="description">Mô tả</Label>
            <Textarea id="description" name="description" defaultValue={product?.description} rows={4} />
          </div>
          <div>
            <Label htmlFor="price">Giá</Label>
            <Input id="price" type="number" name="price" defaultValue={product?.price} required />
          </div>
          <div>
            <Label htmlFor="category">Danh mục</Label>
            <Input id="category" name="category" defaultValue={product?.category} required />
          </div>
          <div>
            <Label htmlFor="status">Trạng thái</Label>
            <Select name="status" defaultValue={product?.status || "DRAFT"}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Nháp</SelectItem>
                <SelectItem value="ACTIVE">Đang bán</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" size="lg">
          {product ? "Cập nhật sản phẩm" : "Tạo sản phẩm mới"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/products")}>
          Hủy
        </Button>
      </div>
    </form>
  );
}