// app/admin/layout.tsx
"use client"; // DÒNG NÀY LÀM NÓ THÀNH CLIENT COMPONENT 

import { ReactNode } from "react";
import Link from "next/link";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-800">Mini Admin</h1>
        </div>
        <nav className="mt-6">
          <Link href="/admin/dashboard">
            <div className="px-6 py-3 hover:bg-gray-100 cursor-pointer flex items-center gap-3 text-gray-700">
              Dashboard
            </div>
          </Link>
          <Link href="/admin/products">
            <div className="px-6 py-3 bg-blue-50 text-blue-700 font-medium cursor-pointer flex items-center gap-3 border-l-4 border-blue-700">
              Quản lý sản phẩm
            </div>
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header + Logout */}
        <header className="bg-white shadow-sm px-8 py-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Welcome back, Admin!</h2>
            <div className="flex items-center gap-6">
              <span className="text-sm text-gray-600">admin@example.com</span>
              <button
                onClick={() => (window.location.href = "/auth/login")}
                className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </header>

        {/* Nội dung chính */}
        <main className="flex-1 overflow-auto p-8 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}