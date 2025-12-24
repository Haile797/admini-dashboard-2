"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (!res || res.error) {
      setLoading(false);
      setError("Email hoặc mật khẩu không đúng");
      return;
    }

    // 🔑 LẤY SESSION SAU LOGIN ĐỂ BIẾT ROLE
    const sessionRes = await fetch("/api/auth/session");
    const session = await sessionRes.json();

    setLoading(false);

    // 🔀 REDIRECT THEO ROLE
    if (session?.user?.role?.toLowerCase() === "admin") {
      router.push("/admin/dashboard");
    } else {
      router.push("/products");
    }

    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Mini Admin</h2>
          <p className="mt-2 text-gray-600">Đăng nhập hệ thống</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white p-8 rounded-lg shadow"
        >
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full border rounded px-3 py-2"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded bg-blue-600 text-white font-medium disabled:opacity-60"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>

          <div className="text-sm text-muted-foreground mt-4">
            <p className="font-medium">Demo accounts:</p>
            <p>admin@example.com / 123456</p>
            <p>staff@example.com / 123456</p>
            <p>user@example.com / 123456</p>
          </div>
        </form>
      </div>
    </div>
  );
}
