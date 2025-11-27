import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const staffRole = await prisma.role.findFirst({ where: { name: "STAFF" } });

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        roleId: staffRole?.id,
      },
    });

    return NextResponse.json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
