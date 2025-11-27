import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;

    // Chỉ cho phép user có roleId truy cập /admin
    if (req.nextUrl.pathname.startsWith("/admin") && !token?.roleId) {
      return NextResponse.redirect(new URL("/auth/unauthorized", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: { authorized: ({ token }) => !!token },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};
