// components/admin/Sidebar.tsx
import Link from "next/link";

export function Sidebar() {
  return (
    <aside className="w-64 bg-white shadow-md h-screen">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-gray-800">Mini Admin</h1>
      </div>
      <nav className="mt-6">
        <Link href="/admin/dashboard">
          <div className="px-6 py-3 hover:bg-gray-100 cursor-pointer flex items-center gap-3 text-gray-700">
            <span>Dashboard</span>
          </div>
        </Link>
        <Link href="/admin/products">
          <div className="px-6 py-3 bg-blue-50 text-blue-700 font-medium cursor-pointer flex items-center gap-3">
            <span>Quản lý sản phẩm</span>
          </div>
        </Link>
      </nav>
    </aside>
  );
}