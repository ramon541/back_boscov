import { StatusCodes } from "http-status-codes";

import genreSchema, { IGenre } from "../models/genre";
import { IResponse } from "../interfaces";
import prisma from "../../prisma/prismaClient";

export interface IApiGenreController {
  createGenre: (req: any, res: any, next: any) => Promise<void>;
  getGenre: (req: any, res: any, next: any) => Promise<void>;
  getAllGenres: (req: any, res: any, next: any) => Promise<void>;
  updateGenre: (req: any, res: any, next: any) => Promise<void>;
  deleteGenre: (req: any, res: any, next: any) => Promise<void>;
}

const genreController: IApiGenreController = {
  createGenre: async (req, res, next) => {
    let response: IResponse<number | null> | null = null;
    try {
      const data = genreSchema.parse(req.body);

      const genre = await prisma.genre.create({
        data,
      });

      if (!genre) {
        response = {
          success: false,
          message: "Genre not created!",
          data: null,
        };

        res.status(StatusCodes.BAD_REQUEST).json(response);
      }

      response = {
        success: true,
        message: "Genre created!",
        data: genre.id,
      };

      res.status(StatusCodes.CREATED).json(response);
    } catch (error) {
      next(error);
    }
  },

  // ==========================================================================
  getGenre: async (req, res, next) => {
    let response: IResponse<IGenre | null> | null = null;
    try {
      const genreId = Number(req.params.id);

      if (isNaN(genreId)) {
        response = { success: false, message: "Invalid params", data: null };
        res.status(StatusCodes.BAD_REQUEST).json(response);
      }
      const genre = await prisma.genre.findUnique({
        where: {
          id: genreId,
        },
      });
      if (!genre) {
        response = {
          success: true,
          message: "Genre don't exist!",
          data: null,
        };
        res.status(StatusCodes.IM_A_TEAPOT).json(response);
      }
      response = { success: true, message: "Genre found!", data: genre };
      res.status(StatusCodes.OK).json(response);
    } catch (error) {
      next(error);
    }
  },

  // ==========================================================================
  getAllGenres: async (req, res, next) => {
    let response: IResponse<Array<IGenre> | null> | null = null;
    try {
      const genres = await prisma.genre.findMany();

      if (!genres) {
        response = {
          success: true,
          message: "Database is empty!",
          data: null,
        };

        res.status(StatusCodes.NO_CONTENT).json(response);
      }

      response = { success: true, message: "Genres found!", data: genres };
      res.status(StatusCodes.OK).json(response);
    } catch (error) {
      next(error);
    }
  },

  // ==========================================================================
  updateGenre: async (req, res, next) => {
    let response: IResponse<IGenre | null> | null = null;
    try {
      const data = genreSchema.parse(req.body);

      const genre = await prisma.genre.update({
        where: {
          id: Number(req.body.id),
        },
        data,
      });

      if (!genre) {
        response = {
          success: true,
          message: "Genre don't exist!",
          data: null,
        };

        res.status(StatusCodes.NO_CONTENT).json(response);
      }

      response = { success: true, message: "Genre updated!", data: genre };
      res.status(StatusCodes.OK).json(response);
    } catch (error) {
      next(error);
    }
  },

  // ==========================================================================
  deleteGenre: async (req, res, next) => {
    let response: IResponse<boolean | null> | null = null;
    try {
      const genreId = Number(req.params.id);

      if (isNaN(genreId)) {
        response = { success: false, message: "Invalid params", data: null };
        res.status(StatusCodes.BAD_REQUEST).json(response);
      }

      const data = await prisma.genre.delete({
        where: {
          id: Number(req.params.id),
        },
      });

      if (!data) {
        response = {
          success: true,
          message: "Genre don't exist!",
          data: null,
        };

        res.status(StatusCodes.NO_CONTENT).json(response);
      }

      response = { success: true, message: "Genre deleted!", data: true };
      res.status(StatusCodes.OK).json(response);
    } catch (error) {
      next(error);
    }
  },
} as const;

export default genreController;
