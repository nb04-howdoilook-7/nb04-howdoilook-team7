/*
  Warnings:

  - You are about to drop the column `imageId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[url]` on the table `Image` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[publicId]` on the table `Image` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Image` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `publicId` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."User" DROP CONSTRAINT "User_imageId_fkey";

-- DropIndex
DROP INDEX "public"."User_imageId_key";

-- AlterTable
ALTER TABLE "public"."Image" ADD COLUMN     "publicId" TEXT NOT NULL,
ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "imageId";

-- CreateIndex
CREATE UNIQUE INDEX "Image_url_key" ON "public"."Image"("url");

-- CreateIndex
CREATE UNIQUE INDEX "Image_publicId_key" ON "public"."Image"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "Image_userId_key" ON "public"."Image"("userId");

-- AddForeignKey
ALTER TABLE "public"."Image" ADD CONSTRAINT "Image_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
