/*
  Warnings:

  - Changed the type of `on_diet` on the `meals` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "meals" DROP COLUMN "on_diet",
ADD COLUMN     "on_diet" INTEGER NOT NULL;
