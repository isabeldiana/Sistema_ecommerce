import { Request, Response } from 'express';
import { ordersDto } from '../Orders/orders.dto';
import prisma from '../../database/prismaClient';
import products from '../Products/products';


const createOrder = async (req: Request, res: Response) => {
  try {
    const { items }: { items: ordersDto[] } = req.body;
    const { id } = req.params;
    const clientExist = await prisma.usuarios.findFirst({ where: { id: parseInt(id) } });
    if (!clientExist) {
      return res.status(404).json({ error: "Cliente não encontrado." });
    }
    const generateId = (): number => {
      return Math.floor(Math.random() * 1000000);
    };

    const id_order = generateId();
    const ordersDate =  new Date();

    for (const item of items) {
      const { produto_id, quantidade } = item;

      const products = await prisma.produtos.findUnique({
        where: { id: produto_id }
      });

      if (!products) {
        return res.status(404).json({ error: `Produto com ID ${produto_id} não encontrado.` });
      }


      if (quantidade <= 0 || quantidade > products.estoque) {
        return res.status(400).json({ error: `Quantidade inválida. A quantidade deve ser maior que 0 e menor ou igual ao estoque disponível (${products.estoque}).` });
      }

      const newOrder = await prisma.pedidos.create({
        data: {
          id_pedidos: id_order,
          cliente_id: parseInt(id),
          produto_id,
          quantidade,
          created_at: ordersDate,

        }
      })
      await prisma.produtos.update({
        where: { id: produto_id },
        data: {
          estoque: products.estoque - quantidade
        }
      });
    }

    const orders = await prisma.pedidos.findMany({
      where: {
        cliente_id: Number(id),
        id_pedidos: Number(id_order)
      },
      select: {
        cliente_id: true,
        id_pedidos: true,
        quantidade: true,
        produtos: {
          select: {
            nome: true,
            id: true,
          }
        }
      }

    });


    const resultOrders = {
      cliente_id: id,
      numero_pedido: id_order,
      produtos: orders.map((product) => ({
        id_produto: product.produtos.id,
        nome: product.produtos.nome,
        quantidade: product.quantidade,
      })),
      data_da_compra: ordersDate
  
    };

    return res.status(200).json(resultOrders);

  } catch (error) {
    return res.status(500).json({ message: "Erro interno do servidor" });
  }

}

export default {
  createOrder
}