import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // =====================
  // 1️⃣ Roles
  // =====================
  const adminRole = await prisma.role.upsert({
    where: { name: "ADMIN" },
    update: {},
    create: { name: "ADMIN" },
  });

  const staffRole = await prisma.role.upsert({
    where: { name: "STAFF" },
    update: {},
    create: { name: "STAFF" },
  });

  const userRole = await prisma.role.upsert({
    where: { name: "USER" },
    update: {},
    create: { name: "USER" },
  });

  // =====================
  // 2️⃣ Users
  // =====================
  const password = await bcrypt.hash("123456", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@example.com",
      password,
      roleId: adminRole.id,
    },
  });

  const staff = await prisma.user.upsert({
    where: { email: "staff@example.com" },
    update: {},
    create: {
      name: "Staff",
      email: "staff@example.com",
      password,
      roleId: staffRole.id,
    },
  });

  const user = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      name: "User",
      email: "user@example.com",
      password,
      roleId: userRole.id,
    },
  });

  // =====================
  // 3️⃣ Categories
  // =====================
  await prisma.category.createMany({
    data: [
      { name: "Điện thoại" },
      { name: "Laptop" },
      { name: "Phụ kiện" },
    ],
    skipDuplicates: true,
  });

  const catPhone = await prisma.category.findFirst({ where: { name: "Điện thoại" } });
  const catLaptop = await prisma.category.findFirst({ where: { name: "Laptop" } });
  const catGear = await prisma.category.findFirst({ where: { name: "Phụ kiện" } });

  // =====================
  // 4️⃣ Products
  // =====================
  await prisma.product.createMany({
    data: [
      {
        name: "iPhone 15",
        description: "Điện thoại mới nhất của Apple",
        price: 25_000_000,
        status: "ACTIVE",
        categoryId: catPhone!.id,
      },
      {
        name: "MacBook Pro 16",
        description: "Laptop mạnh mẽ cho lập trình viên",
        price: 55_000_000,
        status: "ACTIVE",
        categoryId: catLaptop!.id,
      },
      {
        name: "AirPods Pro",
        description: "Tai nghe chống ồn",
        price: 5_000_000,
        status: "ACTIVE",
        categoryId: catGear!.id,
      },
    ],
    skipDuplicates: true,
  });

  const p1 = await prisma.product.findFirst({ where: { name: "iPhone 15" } });
  const p2 = await prisma.product.findFirst({ where: { name: "MacBook Pro 16" } });

  // =====================
  // 5️⃣ Orders (USER)
  // =====================
  for (let i = 1; i <= 10; i++) {
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        total: p1!.price + p2!.price,
        status:
          i % 3 === 0
            ? "completed"
            : i % 2 === 0
            ? "cancelled"
            : "pending",
      },
    });

    await prisma.orderItem.createMany({
      data: [
        {
          orderId: order.id,
          productId: p1!.id,
          price: p1!.price,
          quantity: 1,
        },
        {
          orderId: order.id,
          productId: p2!.id,
          price: p2!.price,
          quantity: 1,
        },
      ],
    });
  }

  console.log("✅ DONE! Seeded roles, users, products, orders.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
