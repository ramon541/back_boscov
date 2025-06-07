import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import prisma from '../../prisma/prismaClient';

export async function checkDuplicateEmail(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const userByEmail = await prisma.user.findUnique({
            where: { email: req.body.email },
        });

        if (userByEmail) {
            res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: 'Já existe um usuário com esse email!',
                data: null,
            });
            return;
        }

        next();
    } catch (err) {
        next(err);
    }
}
