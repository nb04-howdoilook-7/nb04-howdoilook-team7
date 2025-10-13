-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "provider" DROP NOT NULL,
ALTER COLUMN "providerId" DROP NOT NULL;
