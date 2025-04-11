import z, { ZodError } from "zod";

import userSchema, { IUser } from "../models/user";
import { IResponse } from "../interfaces";
import prisma from "../../prisma/prismaClient";
import { StatusCodes } from "http-status-codes";
import { Prisma } from "@prisma/client";

export interface IApiUserController {
  createUser: (req: any, res: any) => Promise<void>;
  getUser: (req: any, res: any) => Promise<void>;
  getAllUsers: (req: any, res: any) => Promise<void>;
  updateUser: (req: any, res: any) => Promise<void>;
  deleteUser: (req: any, res: any) => Promise<void>;
}

const userController: IApiUserController = {
  createUser: async (req, res) => {
    let response: IResponse<number | null> | null = null;

    try {
      const data = userSchema.parse(req.body);

      const user = await prisma.user.create({
        data,
      });

      if (!user) {
        response = {
          success: false,
          message: "User not created!",
          data: null,
        };

        res.status(StatusCodes.BAD_REQUEST).json(response);
      }

      response = {
        success: true,
        message: "User created!",
        data: user.id,
      };

      res.status(StatusCodes.CREATED).json(response);
    } catch (error) {
      if ((error as ZodError)?.errors) {
        const zodErrors = (error as ZodError).errors.map((err) => err.message);

        response = {
          success: false,
          message: zodErrors,
          data: null,
        };

        res.status(StatusCodes.BAD_REQUEST).json(response);
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          response = {
            success: false,
            message:
              "A unique constraint violation occurred. Check your input.",
            data: null,
          };
          res.status(StatusCodes.CONFLICT).json(response);
        }
      }

      response = {
        success: false,
        message:
          "Internal server error: " + (error as Error)?.message ??
          "Unknown error",
        data: null,
      };
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
  },

  // ==========================================================================
  getUser: async (req, res) => {
    let response: IResponse<IUser | null> | null = null;

    try {
      const userId = Number(req.params.id);

      if (isNaN(userId)) {
        response = { success: false, message: "Invalid params", data: null };
        res.status(StatusCodes.BAD_REQUEST).json(response);
      }
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      if (!user) {
        response = {
          success: true,
          message: "User don't exist!",
          data: null,
        };
        res.status(StatusCodes.IM_A_TEAPOT).json(response);
      }
      response = { success: true, message: "User found!", data: user };
      res.status(StatusCodes.OK).json(response);
    } catch (error) {
      if ((error as ZodError)?.errors) {
        const zodErrors = (error as ZodError).errors.map((err) => err.message);

        response = {
          success: false,
          message: zodErrors,
          data: null,
        };

        res.status(StatusCodes.BAD_REQUEST).json(response);
      }

      response = {
        success: false,
        message:
          "Internal server error: " + (error as Error)?.message ??
          "Unknown error",
        data: null,
      };
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
  },

  // ==========================================================================
  getAllUsers: async (req, res) => {
    let response: IResponse<Array<IUser> | null> | null = null;

    try {
      const user = await prisma.user.findMany();

      if (!user) {
        response = {
          success: true,
          message: "Database is empty!",
          data: null,
        };

        res.status(StatusCodes.NO_CONTENT).json(response);
      }

      response = { success: true, message: "Users found!", data: user };
      res.status(StatusCodes.OK).json(response);
    } catch (error) {
      if ((error as ZodError)?.errors) {
        const zodErrors = (error as ZodError).errors.map((err) => err.message);

        response = {
          success: false,
          message: zodErrors,
          data: null,
        };

        res.status(StatusCodes.BAD_REQUEST).json(response);
      }

      response = {
        success: false,
        message:
          "Internal server error: " + (error as Error)?.message ??
          "Unknown error",
        data: null,
      };
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
  },

  // ==========================================================================
  updateUser: async (req, res) => {
    let response: IResponse<IUser | null> | null = null;
    // TODO: Ajustar para não alterar a data de criação!!
    try {
      const data = userSchema.parse(req.body);

      const user = await prisma.user.update({
        where: {
          id: Number(req.body.id),
        },
        data,
      });

      if (!user) {
        response = {
          success: true,
          message: "User don't exist!",
          data: null,
        };

        res.status(StatusCodes.NO_CONTENT).json(response);
      }

      response = { success: true, message: "User updated!", data: user };
      res.status(StatusCodes.OK).json(response);
    } catch (error) {
      if ((error as ZodError)?.errors) {
        const zodErrors = (error as ZodError).errors.map((err) => err.message);

        response = {
          success: false,
          message: zodErrors,
          data: null,
        };

        res.status(StatusCodes.BAD_REQUEST).json(response);
      }

      response = {
        success: false,
        message:
          "Internal server error: " + (error as Error)?.message ??
          "Unknown error",
        data: null,
      };
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
  },

  // ==========================================================================
  deleteUser: async (req, res) => {
    let response: IResponse<boolean | null> | null = null;

    try {
      const userId = Number(req.params.id);

      if (isNaN(userId)) {
        response = { success: false, message: "Invalid params", data: null };
        res.status(StatusCodes.BAD_REQUEST).json(response);
      }

      const data = await prisma.user.delete({
        where: {
          id: Number(req.params.id),
        },
      });

      if (!data) {
        response = {
          success: true,
          message: "User don't exist!",
          data: null,
        };

        res.status(StatusCodes.NO_CONTENT).json(response);
      }

      response = { success: true, message: "User deleted!", data: true };
      res.status(StatusCodes.OK).json(response);
    } catch (error) {
      if ((error as ZodError)?.errors) {
        const zodErrors = (error as ZodError).errors.map((err) => err.message);

        response = {
          success: false,
          message: zodErrors,
          data: null,
        };

        res.status(StatusCodes.BAD_REQUEST).json(response);
      }

      response = {
        success: false,
        message:
          "Internal server error: " + (error as Error)?.message ??
          "Unknown error",
        data: null,
      };
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
  },
} as const;

export default userController;
