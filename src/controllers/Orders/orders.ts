import { Request, Response } from 'express';
import { ordersDto } from '../Orders/orders.dto';
import prisma from '../../database/prismaClient';

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
    const ordersDate = new Date();

    for (const item of items) {
      const { produto_id, quantidade } = item;

      const products = await prisma.produtos.findUnique({
        where: { id: produto_id }
      });

      if (!products) {
        return res.status(404).json({ error: `Produto com ID ${produto_id} não encontrado.` });
      }


      if (quantidade <= 0 || quantidade > products.estoque) {
        return res.status(400).json({ error: `Estoque insufiente, no momento exitem (${products.estoque}) deste produto. ` });
      }

      await prisma.pedidos.create({
        data: {
          id_pedido: id_order,
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
        id_pedido: Number(id_order)
      },
      select: {
        cliente_id: true,
        id_pedido: true,
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

const showeAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.pedidos.groupBy({
      by: ['id_pedido', 'cliente_id', 'created_at']
    });
    let orderDetails = [];

    for (const order of orders) {

      const productData = await prisma.pedidos.findMany({
        where: {
          id_pedido: order.id_pedido,
        },
        select: {
          cliente_id: true,
          id_pedido: true,
          quantidade: true,
          created_at: true,
          produtos: {
            select: {
              nome: true,
              id: true,
            }
          }
        }
      });


      orderDetails.push({
        cliente_id: order.cliente_id,
        id_pedido: order.id_pedido,
        data_compra: order.created_at,
        produtos: productData.map(product => ({
          id: product.produtos.id,
          nome: product.produtos.nome,
          quantidade: product.quantidade
        }))
      });
    }

    return res.status(200).json(orderDetails);
  } catch (error) {
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
}

const showeOrdersByClient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const orders = await prisma.pedidos.groupBy({
      by: ['id_pedido', 'cliente_id', 'created_at'],
      where: {
        cliente_id: parseInt(id)
      },
    });
    let orderDetails = [];

    for (const order of orders) {

      const productData = await prisma.pedidos.findMany({
        where: {
          id_pedido: order.id_pedido,
        },
        select: {
          cliente_id: true,
          id_pedido: true,
          quantidade: true,
          created_at: true,
          produtos: {
            select: {
              nome: true,
              id: true,
            }
          }
        }
      });


      orderDetails.push({

        cliente_id: order.cliente_id,
        id_pedido: order.id_pedido,
        data_compra: order.created_at,
        produtos: productData.map(product => ({
          id: product.produtos.id,
          nome: product.produtos.nome,
          quantidade: product.quantidade
        }))
      });
    }

    return res.status(200).json(orderDetails);
  } catch (error) {
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
}

export default {
  createOrder,
  showeAllOrders,
  showeOrdersByClient
}