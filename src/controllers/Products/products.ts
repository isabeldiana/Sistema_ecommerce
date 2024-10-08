import { Request, Response } from 'express';
import prisma from '../../database/prismaClient';
import { productsDto } from '../Products/products.dto';

const createProduct = async (req: Request, res: Response) => {
  try {
    const { nome, descricao, preco, estoque }: productsDto = req.body;
    const newProduct = await prisma.produtos.create(
      {
        data: {
          nome,
          descricao,
          preco,
          estoque,
          created_at: new Date()
        }
      })

    const resultProduct = {
      id: newProduct.id,
      nome: newProduct.nome,
      descricao: newProduct.descricao,
      preco: Math.round(newProduct.preco.toNumber() * 100) / 100,
      estoque: newProduct.estoque,
      created_at: newProduct.created_at,
    };
    return res.status(200).json(resultProduct);
  } catch (error) {
    return res.status(500).json({ message: "Error interno do servidor" });
  }
}

const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nome, descricao, preco, estoque }: productsDto = req.body;
    const existProduct = await prisma.produtos.findFirst({ where: { id: parseInt(id) } })

    if (!existProduct) {
      return res.status(404).json({ message: "Produto não encontrado" })
    }

    const updatedData: { nome?: string; descricao?: string; preco?: number; estoque?: number } = {};

    if (nome !== undefined) {
      updatedData.nome = nome;
    }
    if (descricao !== undefined) {
      updatedData.descricao = descricao;
    }
    if (preco !== undefined) {
      updatedData.preco = preco;
    }
    if (estoque !== undefined) {
      updatedData.estoque = estoque; 
    }

    const updateProduct = await prisma.produtos.update({
      where: { id: parseInt(id) },
      data: updatedData, 
    });
    return res.status(200).json(updateProduct)


  } catch (error) {
    return res.status(500).json({ message: "Error interno do servidor" });
  }
}

const deleteProduct = async (req: Request, res: Response) => {
      const { id } = req.params;
  try {

    const existProduct = await prisma.produtos.findFirst({ where: { id: parseInt(id) } })
    if (!existProduct) {
      return res.status(404).json({ message: "Produto não encontrado" })
    }

    const existOrder = await prisma.pedidos.findFirst({ where: { produto_id: parseInt(id) } })
    if (existOrder) {
      return res.status(404).json({ message: "Produto não pode ser deletado, pois existe pedido vinculado." })
    }
    await prisma.produtos.delete({ where: { id: parseInt(id) } })

    return res.status(200).send();

  } catch (error) {
    return res.status(500).json({ message: "Error interno do servidor" });
  }

};

const showStock = async (req: Request, res: Response) => {
  try {
    const productStock = await prisma.produtos.findMany({
      where: {
        estoque: {
          gt: 0
        }
      }
    });

    return res.status(200).json(productStock);
  } catch (error) {
    return res.status(500).json({ message: "Error interno do servidor" });

  }

}

export default {
  createProduct,
  updateProduct,
  deleteProduct,
  showStock
}