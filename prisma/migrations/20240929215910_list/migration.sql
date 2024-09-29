/*
  Warnings:

  - You are about to drop the `_ListToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `masterId` to the `List` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ListToUser" DROP CONSTRAINT "_ListToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_ListToUser" DROP CONSTRAINT "_ListToUser_B_fkey";

-- AlterTable
ALTER TABLE "List" ADD COLUMN     "masterId" TEXT NOT NULL,
ADD COLUMN     "name" TEXT;

-- DropTable
DROP TABLE "_ListToUser";

-- CreateTable
CREATE TABLE "_ListUsers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ListUsers_AB_unique" ON "_ListUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_ListUsers_B_index" ON "_ListUsers"("B");

-- AddForeignKey
ALTER TABLE "List" ADD CONSTRAINT "List_masterId_fkey" FOREIGN KEY ("masterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ListUsers" ADD CONSTRAINT "_ListUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ListUsers" ADD CONSTRAINT "_ListUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
