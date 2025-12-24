// app/layout.tsx
import "./globals.css";
import NextAuthProvider from "@/components/providers/SessionProvider";

export const metadata = {
  title: "Mini Admin Dashboard",
  description: "Admin dashboard template",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NextAuthProvider>
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}