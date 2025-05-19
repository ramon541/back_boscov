import { StatusCodes } from "http-status-codes";

import userSchema, { IUser } from "../models/user";
import { IApiController, IResponse } from "../interfaces";
import prisma from "../../prisma/prismaClient";

export type IApiUserController = IApiController<IUser>;

const userController: IApiUserController = {
  create: async (req, res, next) => {
    let response: IResponse<number | null> | null = null;

    try {
      const data = userSchema.parse(req.body);

      const user = await prisma.user.create({
        data,
      });

      if (!user) {
        response = {
          success: false,
          message: "Não foi possível adicionar o usuário!",
          data: null,
        };

        res.status(StatusCodes.BAD_REQUEST).json(response);
        return;
      }

      response = {
        success: true,
        message: "Usuário adicionado com sucesso!",
        data: user.id,
      };

      res.status(StatusCodes.CREATED).json(response);
      return;
    } catch (error) {
      next(error);
    }
  },

  // ==========================================================================
  get: async (req, res, next) => {
    let response: IResponse<IUser | null> | null = null;

    try {
      const userId = Number(req.params.id);

      if (isNaN(userId)) {
        response = { success: false, message: "Invalid params", data: null };
        res.status(StatusCodes.BAD_REQUEST).json(response);
        return;
      }
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      if (!user) {
        response = {
          success: false,
          message: "Esse usuário não existe!",
          data: null,
        };
        res.status(StatusCodes.NOT_FOUND).json(response);
        return;
      }
      response = { success: true, message: "Usuário encontrado!", data: user };
      res.status(StatusCodes.OK).json(response);
      return;
    } catch (error) {
      next(error);
    }
  },

  // ==========================================================================
  getAll: async (req, res, next) => {
    let response: IResponse<Array<IUser> | null> | null = null;

    try {
      const users = await prisma.user.findMany();

      if (!users || users.length === 0) {
        response = {
          success: true,
          message: "Database is empty!",
          data: [],
        };

        res.status(StatusCodes.NO_CONTENT).json(response);
        return;
      }

      response = {
        success: true,
        message: "Usuários encontrados!",
        data: users,
      };
      res.status(StatusCodes.OK).json(response);
      return;
    } catch (error) {
      next(error);
    }
  },

  // ==========================================================================
  update: async (req, res, next) => {
    let response: IResponse<IUser | null> | null = null;
    try {
      const data = userSchema.parse(req.body);

      const { createdAt, ...updateData } = data;

      const existingUser = await prisma.user.findUnique({
        where: { id: Number(req.body.id) },
      });

      if (!existingUser) {
        response = {
          success: false,
          message: "Esse usuário não existe!",
          data: null,
        };

        res.status(StatusCodes.BAD_REQUEST).json(response);
        return;
      }

      const user = await prisma.user.update({
        where: {
          id: Number(req.body.id),
        },
        data: updateData,
      });

      response = { success: true, message: "Usuário atualizado!", data: user };
      res.status(StatusCodes.OK).json(response);
      return;
    } catch (error) {
      next(error);
    }
  },

  // ==========================================================================
  delete: async (req, res, next) => {
    let response: IResponse<boolean | null> | null = null;

    try {
      const userId = Number(req.params.id);

      if (isNaN(userId)) {
        response = { success: false, message: "Invalid params", data: null };
        res.status(StatusCodes.BAD_REQUEST).json(response);
        return;
      }

      const existingUser = await prisma.user.findUnique({
        where: { id: Number(req.params.id) },
      });

      if (!existingUser) {
        response = {
          success: false,
          message: "Esse usuário não existe!",
          data: null,
        };

        res.status(StatusCodes.BAD_REQUEST).json(response);
        return;
      }

      const data = await prisma.user.delete({
        where: {
          id: Number(req.params.id),
        },
      });

      if (!data) {
        response = {
          success: false,
          message: "Esse usuário não existe!",
          data: null,
        };

        res.status(StatusCodes.NO_CONTENT).json(response);
        return;
      }

      response = { success: true, message: "Usuário deletado!", data: true };
      res.status(StatusCodes.OK).json(response);
      return;
    } catch (error) {
      next(error);
    }
  },
};

export default userController;
