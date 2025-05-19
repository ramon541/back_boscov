/*
  Warnings:

  - You are about to alter the column `releaseYear` on the `movie` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `movie` MODIFY `releaseYear` INTEGER NOT NULL;
