import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // --- 1. Tạo roles ---
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: { name: 'admin' },
  });

  const userRole = await prisma.role.upsert({
    where: { name: 'user' },
    update: {},
    create: { name: 'user' },
  });

  // --- 2. Tạo admin ---
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@example.com',
      password: adminPassword,
      roleId: adminRole.id,
    },
  });

  // --- 3. Tạo 2 user thường ---
  const user1Password = await bcrypt.hash('user123', 10);
  const user2Password = await bcrypt.hash('user456', 10);

  await prisma.user.upsert({
    where: { email: 'user1@example.com' },
    update: {},
    create: {
      name: 'User One',
      email: 'user1@example.com',
      password: user1Password,
      roleId: userRole.id,
    },
  });

  await prisma.user.upsert({
    where: { email: 'user2@example.com' },
    update: {},
    create: {
      name: 'User Two',
      email: 'user2@example.com',
      password: user2Password,
      roleId: userRole.id,
    },
  });

  const beautifulProducts = [
    { name: "MacBook Pro 14 M3",        price: 45990000, category: "Laptop",        status: "ACTIVE", imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a2f7?w=800" },
    { name: "iPhone 15 Pro Max",        price: 33990000, category: "Điện thoại",    status: "ACTIVE", imageUrl: "https://images.unsplash.com/photo-1695639299724-1c0d8d2d5e8b?w=800" },
    { name: "AirPods Pro 2",            price: 6290000,  category: "Tai nghe",      status: "ACTIVE", imageUrl: "https://images.unsplash.com/photo-1606220588913-b4747d67b29c?w=800" },
    { name: "Samsung Galaxy S24 Ultra", price: 31990000, category: "Điện thoại",    status: "ACTIVE", imageUrl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800" },
    { name: "Dell XPS 13",              price: 38990000, category: "Laptop",        status: "DRAFT",  imageUrl: "https://images.unsplash.com/photo-1593642634315-48f5414c3ad9?w=800" },
    { name: "Sony WH-1000XM5",          price: 8490000,  category: "Tai nghe",      status: "ACTIVE", imageUrl: "https://images.unsplash.com/photo-1618366713919-7e3b3503b1f4?w=800" },
    { name: "iPad Pro 12.9 M2",         price: 32990000, category: "Máy tính bảng", status: "ACTIVE", imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b6?w=800" },
    { name: "Apple Watch Ultra 2",      price: 21990000, category: "Đồng hồ",       status: "DRAFT",  imageUrl: "https://images.unsplash.com/photo-1579586337277-327cface4c7e?w=800" },
    { name: "Logitech MX Master 3S",    price: 2890000,  category: "Phụ kiện",      status: "ACTIVE", imageUrl: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ac?w=800" },
    { name: "Kindle Paperwhite",        price: 3990000,  category: "Máy đọc sách",  status: "ACTIVE", imageUrl: "https://images.unsplash.com/photo-1606921527827-8d0e2d34e6a5?w=800" },
    { name: "Nintendo Switch OLED",    price: 8990000,  category: "Máy chơi game", status: "ACTIVE", imageUrl: "https://images.unsplash.com/photo-1632863249285-4f31e7b7b0f2?w=800" },
    { name: "GoPro HERO12 Black",       price: 10990000, category: "Camera",        status: "DRAFT",  imageUrl: "https://images.unsplash.com/photo-1564466809058-9302f95b66b7?w=800" },
    { name: "Bose QuietComfort Ultra",  price: 9990000,  category: "Tai nghe",      status: "ACTIVE", imageUrl: "https://images.unsplash.com/photo-1613040809024-b4ef374c1d1d?w=800" },
    { name: "Razer Blade 16",           price: 69990000, category: "Laptop",        status: "ACTIVE", imageUrl: "https://images.unsplash.com/photo-1593642632823-8f2e0a5e9f2f?w=800" },
    { name: "Samsung Odyssey G9",       price: 28990000, category: "Màn hình",      status: "ACTIVE", imageUrl: "https://images.unsplash.com/photo-1588108248754-3d9d7e5f6d3f?w=800" },
  ];

  for (const p of beautifulProducts) {
    await prisma.product.upsert({
      where: { name: p.name },
      update: {},
      create: p,
    });
  }

  console.log("15 beautiful products seeded!");
  // --- 5. Tạo 2 order demo ---
  const user1 = await prisma.user.findUnique({ where: { email: 'user1@example.com' } });
  const productA = await prisma.product.findUnique({ where: { name: 'Product A' } });
  const productB = await prisma.product.findUnique({ where: { name: 'Product B' } });

  if (user1 && productA && productB) {
    const order = await prisma.order.create({
      data: {
        userId: user1.id,
        total: productA.price + productB.price,
        status: 'pending',
        orderItems: {
          create: [
            { productId: productA.id, quantity: 1, price: productA.price },
            { productId: productB.id, quantity: 1, price: productB.price },
          ],
        },
      },
    });
    console.log('Demo order created with id:', order.id);
  }

  console.log('✅ Full seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
