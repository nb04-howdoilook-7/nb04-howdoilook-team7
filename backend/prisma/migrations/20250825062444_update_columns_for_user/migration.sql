/*
  Warnings:

  - You are about to drop the column `nickname` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `nickname` on the `Curation` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Curation` table. All the data in the column will be lost.
  - You are about to drop the column `nickname` on the `Style` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Style` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[styleId,userId]` on the table `Curation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[imageId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Curation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Style` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Curation_styleId_nickname_key";

-- AlterTable
ALTER TABLE "public"."Comment" DROP COLUMN "nickname",
DROP COLUMN "password",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Curation" DROP COLUMN "nickname",
DROP COLUMN "password",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Style" DROP COLUMN "nickname",
DROP COLUMN "password",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "imageId" INTEGER,
ADD COLUMN     "profileImage" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Curation_styleId_userId_key" ON "public"."Curation"("styleId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_imageId_key" ON "public"."User"("imageId");

-- AddForeignKey
ALTER TABLE "public"."Style" ADD CONSTRAINT "Style_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Curation" ADD CONSTRAINT "Curation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "public"."Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;
