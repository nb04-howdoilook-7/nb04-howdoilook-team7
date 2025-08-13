/*
  Warnings:

  - The primary key for the `Comment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Comment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Curation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Curation` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Image` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Image` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Style` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Style` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `curationId` on the `Comment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `styleId` on the `Curation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `styleId` on the `Image` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "public"."Comment" DROP CONSTRAINT "Comment_curationId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Curation" DROP CONSTRAINT "Curation_styleId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Image" DROP CONSTRAINT "Image_styleId_fkey";

-- AlterTable
ALTER TABLE "public"."Comment" DROP CONSTRAINT "Comment_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "curationId",
ADD COLUMN     "curationId" INTEGER NOT NULL,
ADD CONSTRAINT "Comment_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."Curation" DROP CONSTRAINT "Curation_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "styleId",
ADD COLUMN     "styleId" INTEGER NOT NULL,
ADD CONSTRAINT "Curation_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."Image" DROP CONSTRAINT "Image_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "styleId",
ADD COLUMN     "styleId" INTEGER NOT NULL,
ADD CONSTRAINT "Image_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."Style" DROP CONSTRAINT "Style_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Style_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Comment_curationId_key" ON "public"."Comment"("curationId");

-- CreateIndex
CREATE UNIQUE INDEX "Curation_styleId_nickname_key" ON "public"."Curation"("styleId", "nickname");

-- AddForeignKey
ALTER TABLE "public"."Curation" ADD CONSTRAINT "Curation_styleId_fkey" FOREIGN KEY ("styleId") REFERENCES "public"."Style"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_curationId_fkey" FOREIGN KEY ("curationId") REFERENCES "public"."Curation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Image" ADD CONSTRAINT "Image_styleId_fkey" FOREIGN KEY ("styleId") REFERENCES "public"."Style"("id") ON DELETE CASCADE ON UPDATE CASCADE;
