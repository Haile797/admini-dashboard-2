import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  status: string;
  imageUrl?: string | null;
};

export async function ProductTable() {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/products`, { cache: "no-store" });
  const products: Product[] = await res.json();

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
          {products.map((p) => (
            <TableRow key={p.id}>
              <TableCell>
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.name} className="w-14 h-14 object-cover rounded-md" />
                ) : (
                  <div className="w-14 h-14 bg-muted border-2 border-dashed rounded-md" />
                )}
              </TableCell>
              <TableCell className="font-medium">{p.name}</TableCell>
              <TableCell>{p.price.toLocaleString("vi-VN")} ₫</TableCell>
              <TableCell>{p.category}</TableCell>
              <TableCell>
                <Badge variant={p.status === "ACTIVE" ? "default" : "secondary"}>
                  {p.status === "ACTIVE" ? "Đang bán" : "Nháp"}
                </Badge>
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button size="icon" variant="ghost" asChild>
                  <Link href={`/admin/products/${p.id}/edit`}><Edit className="h-4 w-4" /></Link>
                </Button>
                <Button size="icon" variant="ghost" className="text-red-600 hover:bg-red-50"
                  onClick={async () => {if (confirm("Xóa sản phẩm này?")) {await fetch(`/api/products/${p.id}`, { method: "DELETE" });
                  window.location.reload();}}}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}