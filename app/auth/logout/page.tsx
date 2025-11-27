"use client";
import { signOut } from "next-auth/react";

export default function LogoutPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-xl mb-4">Are you sure you want to log out?</h1>
      <button
        onClick={() => signOut({ callbackUrl: "/auth/login" })}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}
