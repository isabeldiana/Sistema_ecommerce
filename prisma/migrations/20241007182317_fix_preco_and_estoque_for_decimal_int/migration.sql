/*
  Warnings:

  - Changed the type of `preco` on the `Produtos` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `estoque` on the `Produtos` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Produtos" DROP COLUMN "preco",
ADD COLUMN     "preco" DECIMAL(65,30) NOT NULL,
DROP COLUMN "estoque",
ADD COLUMN     "estoque" INTEGER NOT NULL;
