/*
  Warnings:

  - You are about to drop the column `altoPlay` on the `List` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "List" DROP COLUMN "altoPlay",
ADD COLUMN     "autoPlay" BOOLEAN NOT NULL DEFAULT false;
