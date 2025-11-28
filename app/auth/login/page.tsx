// app/auth/login/page.tsx
"use client";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Mini Admin</h2>
          <p className="mt-2 text-gray-600">Đăng nhập hệ thống quản trị</p>
        </div>

        <form className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                defaultValue="admin@example.com"
                readOnly
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
              <input
                type="password"
                defaultValue="admin123"
                readOnly
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              // Fake login thành công → chuyển thẳng vào admin
              window.location.href = "/admin/products";
            }}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 font-medium"
          >
            Đăng nhập ngay
          </button>
          <p className="text-center text-sm text-gray-600">
            Dùng tài khoản: <span className="font-bold">admin@example.com</span> /{" "}
            <span className="font-bold">admin123</span>
          </p>
        </form>
      </div>
    </div>
  );
}