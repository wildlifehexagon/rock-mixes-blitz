/*
  Warnings:

  - You are about to drop the column `artistId` on the `songs` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "songs" DROP CONSTRAINT "songs_artistId_fkey";

-- AlterTable
ALTER TABLE "songs" DROP COLUMN "artistId";
