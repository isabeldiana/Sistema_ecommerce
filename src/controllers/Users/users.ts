import { Request, Response } from 'express';
import { usersDto } from "./users.dto";
import * as bcrypt from 'bcrypt';
import prisma from '../../database/prismaClient';

const createUsers = async (req: Request, res: Response) => {
  try {
    const { nome_completo, cpf, email, senha, tipo_usuario }: usersDto = req.body;
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

export default {
  createUsers
}