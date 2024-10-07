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

const updateProduct = async (req: Request, res: Response) =>{
  try {
    const {id} = req.params;
    const {nome, descricao, preco, estoque} : productsDto = req.body;
    const existProduct = await prisma.produtos.findFirst({where: {id: parseInt(id)}})

    if(!existProduct){
      return res.status(404).json({message: "Produto não encontrado"})
    }

    const updateProduct = await prisma.produtos.update({
      where: {id: parseInt(id)},
      data:{
        nome,
        descricao,
        preco,
        estoque: existProduct.estoque + estoque
      }
  });


   return res.status(200).json(updateProduct)


  } catch (error) {
    return res.status(500).json({message: "Error interno do servidor"});
  }
}

const deleteProduct = async (req: Request, res: Response) =>{
 try {
  const {id} = req.params;
  const existProduct = await prisma.produtos.findFirst({where: {id: parseInt(id)}})
  if(!existProduct){
    return res.status(404).json({message: "Produto não encontrado"})
  }

  const deleteProduct  = await prisma.produtos.delete({where: {id:parseInt(id)}})

   return res.status(200).send();

 } catch (error) {
  
 }
  
}

export default {
  createProduct,
  updateProduct,
  deleteProduct
}