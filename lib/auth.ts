// lib/auth.ts
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import bcrypt from "bcrypt";

import { prisma } from "@/lib/prisma";

/* ================== TYPES ================== */
type AuthUser = {
  id: string;
  email: string;
  name?: string | null;
  roleId: string;
  role: string;
};

/* ================== NEXT AUTH ================== */
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { role: true },
        });

        if (!user) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) return null;

        const authUser: AuthUser = {
          id: user.id,
          email: user.email,
          name: user.name,
          roleId: user.roleId,
          role: user.role.name,
        };

        return authUser;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as AuthUser;

        token.roleId = u.roleId;
        token.role = u.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.roleId = token.roleId as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/login",
  },
};

/* ================== RBAC HELPERS ================== */

export async function requireAuth() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("UNAUTHORIZED");
  }

  return session;
}

export async function requireAdmin() {
  const session = await requireAuth();

  if (session.user.role !== "ADMIN") {
    throw new Error("FORBIDDEN");
  }

  return session;
}
