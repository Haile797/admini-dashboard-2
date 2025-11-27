// app/admin/layout.tsx
import { Sidebar } from "@/components/admin/Sidebar";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm px-8 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Welcome back, Admin!</h2>
            <div className="text-sm text-gray-600">admin@example.com</div>
          </div>
        </header>
        <main className="p-8 bg-gray-50 min-h-full">
          {children}
        </main>
      </div>
    </div>
  );
}