import { Request, Response, NextFunction } from 'express';

const admMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const { tipo_usuario } = req.params;

  if (tipo_usuario === 'administrador') {
    next(); 
  } else {
    return res.status(403).json({ message: 'Acesso negado. Tipo de usuário inválido.' });
  }
};

const clientMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const { tipo_usuario } = req.params;

  if (tipo_usuario === 'cliente') {
    next(); 
  } else {
    return res.status(403).json({ message: 'Acesso negado. Tipo de usuário inválido.' });
  }
};

export default {
  admMiddleware,
  clientMiddleware
}