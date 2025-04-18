import z, { ZodError } from "zod";

import userSchema, { IUser } from "../models/user";
import { IResponse } from "../interfaces";
import prisma from "../../prisma/prismaClient";
import { StatusCodes } from "http-status-codes";
import { Prisma } from "@prisma/client";
import { Request, Response } from "express";

// Tipos mais específicos para os parâmetros de request e response
export interface IApiUserController {
  createUser: (req: Request, res: Response) => Promise<Response>;
  getUser: (req: Request, res: Response) => Promise<Response>;
  getAllUsers: (req: Request, res: Response) => Promise<Response>;
  updateUser: (req: Request, res: Response) => Promise<Response>;
  deleteUser: (req: Request, res: Response) => Promise<Response>;
}

// Funções utilitárias - Programação Funcional
const createErrorResponse = (message: string | string[], data: any = null): IResponse<any> => ({
  success: false,
  message,
  data
});

const createSuccessResponse = <T>(message: string, data: T): IResponse<T> => ({
  success: true,
  message,
  data
});

const handleZodError = (error: ZodError, res: Response): Response => {
  const zodErrors = error.errors.map(err => err.message);
  return res
    .status(StatusCodes.BAD_REQUEST)
    .json(createErrorResponse(zodErrors));
};

const handlePrismaError = (error: Prisma.PrismaClientKnownRequestError, res: Response): Response | null => {
  if (error.code === "P2002") {
    return res
      .status(StatusCodes.CONFLICT)
      .json(createErrorResponse("A unique constraint violation occurred. Check your input."));
  }
  return null;
};

const handleGenericError = (error: Error, res: Response): Response => {
  const errorMessage = error.message || "Unknown error";
  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json(createErrorResponse(`Internal server error: ${errorMessage}`));
};

const userController: IApiUserController = {
  createUser: async (req, res) => {
    try {
      const data = userSchema.parse(req.body);

      const user = await prisma.user.create({
        data,
      });

      if (!user) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json(createErrorResponse("User not created!"));
      }

      return res
        .status(StatusCodes.CREATED)
        .json(createSuccessResponse("User created!", user.id));

    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        const prismaResponse = handlePrismaError(error, res);
        if (prismaResponse) return prismaResponse;
      }

      return handleGenericError(error as Error, res);
    }
  },

  getUser: async (req, res) => {
    try {
      const userId = Number(req.params.id);

      if (isNaN(userId)) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json(createErrorResponse("Invalid params"));
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json(createSuccessResponse("User doesn't exist!", null));
      }

      return res
        .status(StatusCodes.OK)
        .json(createSuccessResponse("User found!", user));

    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      return handleGenericError(error as Error, res);
    }
  },

  getAllUsers: async (req, res) => {
    try {
      const users = await prisma.user.findMany();

      // findMany retorna um array vazio se não encontrar nada, não null
      if (users.length === 0) {
        return res
          .status(StatusCodes.OK)
          .json(createSuccessResponse("Database is empty!", []));
      }

      return res
        .status(StatusCodes.OK)
        .json(createSuccessResponse("Users found!", users));

    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      return handleGenericError(error as Error, res);
    }
  },

  updateUser: async (req, res) => {
    try {
      const userId = Number(req.body.id);
      
      if (!userId || isNaN(userId)) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json(createErrorResponse("Invalid user ID"));
      }
      
      const data = userSchema.parse(req.body);

      // Exclui campos que não devem ser atualizados
      const { createdAt, ...updateData } = data as any;

      const user = await prisma.user.update({
        where: { id: userId },
        data: updateData,
      });

      return res
        .status(StatusCodes.OK)
        .json(createSuccessResponse("User updated!", user));

    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      
      // Tratar erro de usuário não encontrado
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          return res
            .status(StatusCodes.NOT_FOUND)
            .json(createErrorResponse("User not found"));
        }
        const prismaResponse = handlePrismaError(error, res);
        if (prismaResponse) return prismaResponse;
      }
      
      return handleGenericError(error as Error, res);
    }
  },

  deleteUser: async (req, res) => {
    try {
      const userId = Number(req.params.id);

      if (isNaN(userId)) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json(createErrorResponse("Invalid params"));
      }

      // Tenta excluir o usuário e captura erros de "não encontrado"
      try {
        const deletedUser = await prisma.user.delete({
          where: { id: userId },
        });

        return res
          .status(StatusCodes.OK)
          .json(createSuccessResponse("User deleted!", true));
      } catch (deleteError) {
        if (deleteError instanceof Prisma.PrismaClientKnownRequestError) {
          if (deleteError.code === 'P2025') {
            return res
              .status(StatusCodes.NOT_FOUND)
              .json(createErrorResponse("User not found"));
          }
        }
        throw deleteError; // Re-lança o erro se não for relacionado a "não encontrado"
      }
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      return handleGenericError(error as Error, res);
    }
  },
};

export default userController;
