-- AlterTable
ALTER TABLE "public"."Style" ADD COLUMN     "likeCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "public"."StyleLike" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "styleId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "StyleLike_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StyleLike_styleId_userId_key" ON "public"."StyleLike"("styleId", "userId");

-- AddForeignKey
ALTER TABLE "public"."StyleLike" ADD CONSTRAINT "StyleLike_styleId_fkey" FOREIGN KEY ("styleId") REFERENCES "public"."Style"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StyleLike" ADD CONSTRAINT "StyleLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
