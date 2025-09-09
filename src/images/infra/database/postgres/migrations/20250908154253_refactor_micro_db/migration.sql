/*
  Warnings:

  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users_dates` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users_state` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "images" DROP CONSTRAINT "images_cod_user_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_cod_state_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_cod_ubi_fkey";

-- DropForeignKey
ALTER TABLE "users_dates" DROP CONSTRAINT "users_dates_cod_date_fkey";

-- DropForeignKey
ALTER TABLE "users_dates" DROP CONSTRAINT "users_dates_cod_description_fkey";

-- DropForeignKey
ALTER TABLE "users_dates" DROP CONSTRAINT "users_dates_cod_user_fkey";

-- DropTable
DROP TABLE "users";

-- DropTable
DROP TABLE "users_dates";

-- DropTable
DROP TABLE "users_state";
