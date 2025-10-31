-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "intent" TEXT,
ADD COLUMN     "reasoning" TEXT,
ADD COLUMN     "score" INTEGER;

-- CreateTable
CREATE TABLE "Offer" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "value_props" TEXT[],
    "ideal_use_cases" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Offer_pkey" PRIMARY KEY ("id")
);
