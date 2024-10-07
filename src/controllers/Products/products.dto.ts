import { Prisma } from "@prisma/client";

export type productsDto = {
  nome: string;
  descricao: string;
  preco: Prisma.Decimal;
  estoque: number ;
  created_at: Date
}