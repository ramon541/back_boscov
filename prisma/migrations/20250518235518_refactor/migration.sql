/*
  Warnings:

  - You are about to drop the column `genreId` on the `movie` table. All the data in the column will be lost.
  - You are about to alter the column `classification` on the `movie` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Enum(EnumId(1))`.
  - A unique constraint covering the columns `[genreId,movieId]` on the table `genreMovie` will be added. If there are existing duplicate values, this will fail.
  - Made the column `production` on table `movie` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `movie` DROP FOREIGN KEY `movie_genreId_fkey`;

-- DropIndex
DROP INDEX `movie_genreId_fkey` ON `movie`;

-- AlterTable
ALTER TABLE `movie` DROP COLUMN `genreId`,
    MODIFY `production` VARCHAR(191) NOT NULL,
    MODIFY `classification` ENUM('C_L', 'C_10', 'C_12', 'C_14', 'C_16', 'C_18') NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `genreMovie_genreId_movieId_key` ON `genreMovie`(`genreId`, `movieId`);
