/*
  Warnings:

  - You are about to drop the `refresh_tokens` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "books" DROP CONSTRAINT "books_user_id_fkey";

-- DropForeignKey
ALTER TABLE "refresh_tokens" DROP CONSTRAINT "refresh_tokens_user_id_fkey";

-- DropForeignKey
ALTER TABLE "shelves" DROP CONSTRAINT "shelves_user_id_fkey";

-- DropTable
DROP TABLE "refresh_tokens";

-- DropTable
DROP TABLE "users";

-- DropEnum
DROP TYPE "Gender";
