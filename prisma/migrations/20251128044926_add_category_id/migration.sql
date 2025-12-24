/*
  Warnings:

  - The `status` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `category` on the `Product` table. All the data in the column will be lost.
  - The `status` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('DRAFT', 'ACTIVE');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('pending', 'completed', 'cancelled');

-- DropIndex
DROP INDEX "Product_category_idx";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "status",
ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "category",
ADD COLUMN     "categoryId" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "ProductStatus" NOT NULL DEFAULT 'DRAFT';

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");

-- CreateIndex
CREATE INDEX "Product_status_idx" ON "Product"("status");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
