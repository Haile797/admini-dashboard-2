import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;

    if (
      req.nextUrl.pathname.startsWith("/admin") &&
      token?.role?.toLowerCase() !== "admin"
    ) {
      return NextResponse.redirect(
        new URL("/auth/unauthorized", req.url)
      );
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};
