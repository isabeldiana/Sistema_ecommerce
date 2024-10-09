import { Request, Response } from 'express';
import { usersDto } from "./users.dto";
import * as bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import prisma from '../../database/prismaClient';

const createUsers = async (req: Request, res: Response) => {
  const { nome_completo, cpf, email, senha, tipo_usuario }: usersDto = req.body;
  try {
   
    const existEmail = await prisma.usuarios.findFirst({ where: { email: email } });
    const existCpf = await prisma.usuarios.findFirst({ where: { cpf: cpf } });
    const hashedPassword = await bcrypt.hash(senha, 10);
    if (existEmail) {
      return res.status(401).json({ message: "Este email já existe" })
    }

    if (existCpf) {
      return res.status(401).json({ message: "Este CPF já existe" })
    }

    if (tipo_usuario === "cliente" || tipo_usuario === "administrador") {
      const newUser = await prisma.usuarios.create({
        data: {
          nome_completo,
          cpf,
          email,
          senha: hashedPassword,
          tipo_usuario
        }
      })

      return res.status(200).json(newUser)
    } else {
      return res.status(404).json({ message: "tipo de usuário deve ser cliente ou administrador" })
    }


  } catch (error) {
    return res.status(500).json({ message: "Erro interno do servidor" });
  }

}


const login = async (req: Request, res: Response) =>{
    const {email, senha, tipo_usuario } : usersDto = req.body

  try {

    const secret = process.env.JWT_SECRET || 'your-secret-key';
    const user = await prisma.usuarios.findFirst({where: {email}});

    if (!email || !senha) {
        return res.status(400).json({ error: "Email e senha são obrigatórios" });
      }


      if (tipo_usuario !== 'cliente' && tipo_usuario !== "administrador") {
        return res.status(400).json({ error: "Para realizar login voce precisar ser administrador ou cliente" });
      }
    
    if(!user ){
        return res.status(401).json({ error: "Email incorreto"})
    }

    if(user.tipo_usuario !== tipo_usuario){
      return res.status(401).json({ error: "Tipo de usuario invalido"})
  }
   const validPassword = await bcrypt.compare(senha, user.senha)

    if(!validPassword){
        return res.status(401).json({error: "Senha incorreta"})
    }

    const token =  jwt.sign({userId: user?.id, email: user?.email,  tipo_usuario: user.tipo_usuario}, secret, {expiresIn: "1h"} )
    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ error: "Erro do Servidor Interno"})
 
  }

};


export default {
  createUsers,
  login
}