-- DropForeignKey
ALTER TABLE `review` DROP FOREIGN KEY `review_movieId_fkey`;

-- DropIndex
DROP INDEX `review_movieId_fkey` ON `review`;
