/*
  Warnings:

  - The `status` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropIndex
DROP INDEX "Product_categoryId_idx";

-- DropIndex
DROP INDEX "Product_deletedAt_idx";

-- DropIndex
DROP INDEX "Product_status_idx";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'DRAFT';

-- DropEnum
DROP TYPE "OrderStatus";

-- DropEnum
DROP TYPE "ProductStatus";
