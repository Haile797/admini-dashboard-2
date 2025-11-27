// app/admin/layout.tsx
import { ReactNode } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import Link from 'next/link';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="p-10 text-center">
        <p className="text-lg">You must be logged in to view this page.</p>
        <Link href="/auth/login" className="text-blue-500 underline">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <aside className="w-60 bg-gray-100 p-4 border-r">
        <h2 className="font-bold mb-4">Admin Panel</h2>
        <nav className="flex flex-col gap-2">
          <Link href="/admin/dashboard">Dashboard</Link>
          <Link href="/admin/products">Products</Link>
          <Link href="/admin/orders">Orders</Link>
          <Link href="/admin/users">Users</Link>
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}

// import { ReactNode } from "react";
// import { getServerSession } from "next-auth";
// import { authOptions } from "../api/auth/[...nextauth]/route";
// import Link from "next/link";

// export default async function AdminLayout({ children }: { children: ReactNode }) {
//   const session = await getServerSession(authOptions);

//   if (!session) {
//     return (
//       <div className="p-10 text-center">
//         <p className="text-lg">You must be logged in to view this page.</p>
//         <Link href="/auth/login" className="text-blue-500 underline">
//           Go to Login
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex">
//       <aside className="w-60 bg-gray-100 p-4 border-r">
//         <h2 className="font-bold mb-4">Admin Panel</h2>
//         <nav className="flex flex-col gap-2">
//           <Link href="/admin/dashboard">Dashboard</Link>
//           <Link href="/admin/products">Products</Link>
//           <Link href="/admin/orders">Orders</Link>
//           <Link href="/admin/users">Users</Link>
//         </nav>
//       </aside>
//       <main className="flex-1 p-6">{children}</main>
//     </div>
//   );
// }
