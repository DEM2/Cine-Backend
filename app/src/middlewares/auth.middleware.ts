import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import AppError from "../error/appError";

// Extendemos la interfaz Request nativa de Express para que TypeScript reconozca `req.user`
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
                email: string;
                role: string;
                [key: string]: any;
            };
        }
    }
}

export const verifyToken = (req: Request, res: Response, next: NextFunction): void | Response => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new AppError(401, "Acceso denegado. Token faltante o formato incorrecto.");
        }

        const token = authHeader.split(" ")[1];
        

        const secret = process.env.JWT_ACCESS_SECRET || "tu_secreto_super_seguro"; 

        const decoded = jwt.verify(token, secret) as any;

        // Inyectamos el usuario en la request
        req.user = {
            id: decoded.userId,
            email: decoded.email,
            role: decoded.roleId
        };

        next();

    } catch (error: any) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Su sesión ha expirado. Por favor, inicie sesión nuevamente." });
        }
        
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Token de autenticación inválido." });
        }

        if (error instanceof AppError) {
            return res.status(error.status).json({ message: error.message });
        }

        return res.status(500).json({ message: "Error interno al procesar la autenticación." });
    }
};