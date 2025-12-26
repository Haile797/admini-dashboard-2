"use client";

import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

type ProductDTO = {
  id: string;
  name: string;
  price: number;
  status: string;
  category?: {
    name: string;
  } | null;
};

export default function ProductTable({
  products,
}: {
  products: ProductDTO[];
}) {
  return (
    <div className="rounded border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên</TableHead>
            <TableHead>Danh mục</TableHead>
            <TableHead>Giá</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-right">Hành động</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {products.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="font-medium">{p.name}</TableCell>
              <TableCell>{p.category?.name ?? "-"}</TableCell>
              <TableCell>{p.price.toLocaleString("vi-VN")} ₫</TableCell>
              <TableCell>{p.status}</TableCell>
              <TableCell className="text-right">
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/admin/products/${p.id}/edit`}>Sửa</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
