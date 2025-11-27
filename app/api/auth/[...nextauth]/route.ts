import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import type { JWT } from "next-auth/jwt";
import type { User, Session } from "next-auth";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        // Tìm user và include role
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { role: true },
        });

        if (!user) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        // Trả về user kèm roleId
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          roleId: user.roleId,
          role: user.role?.name,
        };
      },
    }),
  ],
  session: { strategy: "jwt" as const },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
  jwt: async ({ token, user }: { token: JWT; user?: User }) => {
    if (user) {
      token.roleId = (user as any).roleId; // type casting nếu user có roleId
      token.role = (user as any).role;
    }
    return token;
  },
  session: async ({ session, token }: { session: Session; token: JWT }) => {
    if (token) {
      (session.user as any).roleId = token.roleId;
      (session.user as any).role = token.role;
    }
    return session;
  },
},
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
