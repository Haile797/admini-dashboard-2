"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  price: number;
  category: { name: string } | null;
  status: "ACTIVE" | "DRAFT";
  imageUrl?: string | null;
};

export default function ProductTable() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role?.toLowerCase() === "admin";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Không thể tải danh sách sản phẩm");

        const data = await res.json();
        setProducts(Array.isArray(data.items) ? data.items : []);
      } catch (err: any) {
        setError(err.message ?? "Lỗi không xác định");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return <p className="p-4">Đang tải dữ liệu...</p>;

  if (error) {
    return (
      <div className="p-4 text-red-600">
        <p>Lỗi sản phẩm</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-20">Hình</TableHead>
            <TableHead>Tên sản phẩm</TableHead>
            <TableHead>Giá</TableHead>
            <TableHead>Danh mục</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-right">Hành động</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {products.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-muted-foreground"
              >
                Không có sản phẩm
              </TableCell>
            </TableRow>
          )}

          {products.map((p) => (
            <TableRow key={p.id}>
              <TableCell>
                {p.imageUrl ? (
                  <img
                    src={p.imageUrl}
                    className="w-14 h-14 object-cover rounded-md"
                    alt={p.name}
                  />
                ) : (
                  <div className="w-14 h-14 bg-muted border-2 border-dashed rounded-md" />
                )}
              </TableCell>

              <TableCell className="font-medium">{p.name}</TableCell>
              <TableCell>{p.price.toLocaleString("vi-VN")} ₫</TableCell>
              <TableCell>{p.category?.name || "Uncategorized"}</TableCell>

              <TableCell>
                <Badge
                  variant={p.status === "ACTIVE" ? "default" : "secondary"}
                >
                  {p.status === "ACTIVE" ? "Đang bán" : "Nháp"}
                </Badge>
              </TableCell>

              <TableCell className="text-right space-x-2">
                {isAdmin && (
                  <>
                    <Button size="icon" variant="ghost" asChild>
                      <Link href={`/admin/products/${p.id}/edit`}>
                        <Edit className="w-4 h-4" />
                      </Link>
                    </Button>

                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-red-600"
                      onClick={async () => {
                        if (!confirm("Xóa sản phẩm này?")) return;

                        const res = await fetch(
                          `/api/products/${p.id}`,
                          { method: "DELETE" }
                        );

                        if (res.ok) {
                          setProducts((prev) =>
                            prev.filter((x) => x.id !== p.id)
                          );
                        } else {
                          alert("Xóa sản phẩm thất bại");
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
