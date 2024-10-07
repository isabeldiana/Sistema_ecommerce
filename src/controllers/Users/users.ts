import {Request, Response} from 'express';
import { usersDto } from "./users.dto";
import prisma from '../../database/prismaClient';

const createUsers = async (req: Request, res: Response) =>  {
 try {
  const {nome_completo, cpf, email, senha, tipo_usuario} : usersDto = req.body;
  const existEmail = await prisma.usuarios.findFirst({where:{email: email}});
  const existCpf = await prisma.usuarios.findFirst({where:{cpf:cpf}});

 if(existEmail){
  return res.status(401).json({message: "Este email já existe"})
 } 

 if(existCpf){
  return res.status(401).json({message: "Este CPF já existe"})
 } 

 
  const newUser =  await prisma.usuarios.create({
    data:{
      nome_completo,
      cpf,
      email,
      senha,
      tipo_usuario
    }
  })

return res.status(200).json(newUser)
 } catch (error) {
  return res.status(500).json({ message: "Erro interno do servidor"});
 }

}

const showUser = async (req: Request, res: Response) =>{
 try {
  const {id}= req.params;
  const showUser = await prisma.usuarios.findFirst({where: {id:Number(id)}})
  if(!showUser){
    return res.status(404).json({message: "Usuario não encontrado"})
  }
 } catch (error) {
  return res.status(500).json({ message: "Erro interno do servidor"});
 }
}

export default {
  createUsers,
  showUser
}