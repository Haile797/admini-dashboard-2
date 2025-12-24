import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      roleId: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    roleId: string;
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    roleId?: string;
    role?: string;
  }
}