import z, { ZodError } from "zod";

import userSchema from "../models/user";
import { IResponse } from "../interfaces";
import prisma from "../../prisma/prismaClient";

export interface IApiUserController {
  createUser: (req: any, res: any) => Promise<void>;
}

const userController: IApiUserController = {
  createUser: async (req, res) => {
    let response: IResponse<number | null> | null = null;

    try {
      const data = userSchema.parse(req.body);

      const user = prisma.user.create({
        data,
      });

      if (!user) {
        response = {
          success: false,
          message: "User not created!",
          data: null,
        };

        return res.status(400).json(response);
      }

      response = {
        success: true,
        message: "User created!",
        data: (await user).id,
      };

      return res.status(201).json(response);
    } catch (error) {
      if ((error as ZodError)?.errors) {
        const zodErrors = (error as ZodError).errors.map((err) => err.message);

        response = {
          success: false,
          message: zodErrors,
          data: null,
        };

        return res.status(400).json(response);
      }

      // TODO: Validar esse erro melhor (está dando constraint error)
      // TODO: Usar a biblioteca de status codes (http-status-codes)
      response = {
        success: false,
        message: "Internal server error" + error,
        data: null,
      };
      return res.status(500).json(response);
    }
  },
} as const;

export default userController;
