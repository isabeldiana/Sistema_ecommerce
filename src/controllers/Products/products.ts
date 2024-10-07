import {Request, Response} from 'express';
import prisma from '../../database/prismaClient';
import {productsDto} from '../Products/products.dto';

const createProduct = async (req: Request, res: Response) => {
 try {
  const {nome, descricao, preco, estoque} : productsDto = req.body;
  const newProduct = await prisma.produtos.create(
    {
      data: {
        nome, 
        descricao, 
        preco, 
        estoque, 
        created_at: new Date()
    }})

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
  console.log(error);
  
  return res.status(500).json({message: "Error interno do servidor"});
 }
}



export default {
  createProduct
}