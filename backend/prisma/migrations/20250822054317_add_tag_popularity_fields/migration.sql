-- AlterTable
ALTER TABLE "public"."Tag" ADD COLUMN     "popularityScore" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "totalUsageCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "public"."TagUsageLog" (
    "id" SERIAL NOT NULL,
    "tagId" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TagUsageLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."TagUsageLog" ADD CONSTRAINT "TagUsageLog_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "public"."Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
