import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import prisma from '../../prisma/prismaClient';
import { log } from 'console';

//= =================================================================================
interface AuthJwtPayload extends JwtPayload {
    id: number;
}

declare module 'express-serve-static-core' {
    interface Request {
        userId?: number;
    }
}

export async function verifyToken(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const tokenHeader =
        req.headers['x-access-token'] || req.headers['authorization'];
    const token = Array.isArray(tokenHeader) ? tokenHeader[0] : tokenHeader;

    if (!token) {
        res.status(StatusCodes.FORBIDDEN).json({
            success: false,
            message: 'Token não fornecido!',
            data: null,
        });
        return;
    }

    try {
        if (!process.env.JWT_SECRET) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'JWT secret is not configured!',
                data: null,
            });
            return;
        }

        const decoded = jwt.verify(
            token.replace('Bearer ', ''),
            process.env.JWT_SECRET
        ) as AuthJwtPayload;

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
        });

        if (!user) {
            res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: 'Não autorizado!',
                data: null,
            });
            return;
        }

        req.userId = decoded.id;

        next();
    } catch (err) {
        next(err);
    }
}

//= =================================================================================
export async function isAdmin(req: Request, res: Response, next: NextFunction) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
        });
        const isAdmin = user?.userType === 'A';

        if (!isAdmin) {
            res.status(StatusCodes.FORBIDDEN).json({
                success: false,
                message: 'Acesso negado! Você não é um administrador.',
                data: null,
            });
            return;
        }

        next();
    } catch (err) {
        next(err);
    }
}
