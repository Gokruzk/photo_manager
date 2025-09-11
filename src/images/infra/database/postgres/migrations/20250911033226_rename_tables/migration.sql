/*
  Warnings:

  - You are about to drop the column `uploadedat` on the `images` table. All the data in the column will be lost.
  - You are about to drop the `date_descriptions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ubication` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `uploaded_at` to the `images` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "images" DROP CONSTRAINT "images_cod_ubi_fkey";

-- DropForeignKey
ALTER TABLE "images" DROP CONSTRAINT "images_uploadedat_fkey";

-- AlterTable
ALTER TABLE "images" DROP COLUMN "uploadedat",
ADD COLUMN     "uploaded_at" INTEGER NOT NULL;

-- DropTable
DROP TABLE "date_descriptions";

-- DropTable
DROP TABLE "ubication";

-- CreateTable
CREATE TABLE "ubications" (
    "cod_ubi" INTEGER NOT NULL,
    "country" VARCHAR(100) NOT NULL,

    CONSTRAINT "ubications_pkey" PRIMARY KEY ("cod_ubi")
);

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_cod_ubi_fkey" FOREIGN KEY ("cod_ubi") REFERENCES "ubications"("cod_ubi") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_uploaded_at_fkey" FOREIGN KEY ("uploaded_at") REFERENCES "dates"("cod_date") ON DELETE RESTRICT ON UPDATE CASCADE;
