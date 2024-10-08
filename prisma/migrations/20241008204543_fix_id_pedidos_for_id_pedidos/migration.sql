/*
  Warnings:

  - You are about to drop the column `id_pedidos` on the `Pedidos` table. All the data in the column will be lost.
  - Added the required column `id_pedido` to the `Pedidos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pedidos" DROP COLUMN "id_pedidos",
ADD COLUMN     "id_pedido" INTEGER NOT NULL;
