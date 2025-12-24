import ProductTable from "@/components/admin/products/ProductTable";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProductsPage() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Quản lý sản phẩm</h1>
        <Button asChild>
          <Link href="/admin/products/new">+ Thêm sản phẩm mới</Link>
        </Button>
      </div>
      <ProductTable />
    </div>
  );
}
