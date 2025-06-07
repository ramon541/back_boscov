import { StatusCodes } from 'http-status-codes';

import userSchema, { IUser } from '../models/user';
import prisma from '../../prisma/prismaClient';
import { createToken, generateHash, verifyHash } from '../utils';
import { RequestHandler } from 'express';
import { loginSchema } from '../models/login';

const authController: IApiAuthController<RequestHandler> = {
    register: async (req, res, next) => {
        let response: IResponse<null> | null = null;

        try {
            const data = userSchema.parse(req.body);

            data.password = await generateHash(data.password);

            await prisma.user.create({
                data,
            });

            response = {
                success: true,
                message: 'Conta criada com sucesso!',
                data: null,
            };

            res.status(StatusCodes.CREATED).json(response);
            return;
        } catch (error) {
            next(error);
        }
    },
    login: async (req, res, next) => {
        let response: IResponse<{
            user: Omit<IUser, 'password' | 'createdAt' | 'updatedAt'>;
            accessToken: string;
        } | null> | null = null;

        try {
            const data = loginSchema.parse(req.body);

            const userByEmail = await prisma.user.findUnique({
                where: { email: data.email },
            });

            if (!userByEmail) {
                response = {
                    success: false,
                    message: 'Email inválido ou não cadastrado!',
                    data: null,
                };
                res.status(StatusCodes.UNAUTHORIZED).json(response);
                return;
            }

            const isPasswordValid = await verifyHash(
                data.password,
                userByEmail.password
            );
            if (!isPasswordValid) {
                response = {
                    success: false,
                    message: 'Senha inválida!',
                    data: null,
                };
                res.status(StatusCodes.UNAUTHORIZED).json(response);
                return;
            }

            const token = createToken(userByEmail.id);

            response = {
                success: true,
                message: 'Login realizado com sucesso!',
                data: {
                    user: {
                        id: userByEmail.id,
                        name: userByEmail.name,
                        email: userByEmail.email,
                        nickname: userByEmail.nickname,
                        active: userByEmail.active,
                        birthDate: userByEmail.birthDate,
                        userType: userByEmail.userType,
                    },
                    accessToken: token,
                },
            };
            res.status(StatusCodes.OK).json(response);
            return;
        } catch (error) {
            next(error);
        }
    },
};

export default authController;
