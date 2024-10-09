import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";


interface CustomJwtPayload extends JwtPayload {
  id: number; 
  tipo_usuario: string;
}

export interface AuthenticatedRequest extends Request {
  user?: CustomJwtPayload | JwtPayload; 
}

const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Nenhum token fornecido" });
  }

  const [, token] = authHeader.split(" ");

  try { 
    const secret = process.env.JWT_SECRET || "your-secret-key"
    const decoded = jwt.verify(token, secret)  as CustomJwtPayload;;
    
    req.user = decoded; 

    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido ou expirado" });

  }
};



const verifyAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const user = req.user;
  if (!user || user.tipo_usuario !== "administrador") {
    return res.status(403).json({ message: "Acesso negado. Você não tem permissão." });
  }

  next(); 
};

const verifyClient = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {

  const user = req.user;
  if (!user || user.tipo_usuario !== "cliente") {
    return res.status(403).json({ message: "Acesso negado. Você não tem permissão." });
  }

  next(); 
}; 

export default { authMiddleware, verifyAdmin, verifyClient}