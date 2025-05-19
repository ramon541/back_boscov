import { StatusCodes } from "http-status-codes";

import genreSchema, { IGenre } from "../models/genre";
import { IApiController, IResponse } from "../interfaces";
import prisma from "../../prisma/prismaClient";

export type IApiGenreController = IApiController<IGenre>;

const genreController: IApiGenreController = {
  create: async (req, res, next) => {
    let response: IResponse<number | null> | null = null;
    try {
      const data = genreSchema.parse(req.body);

      const genre = await prisma.genre.create({
        data,
      });

      if (!genre) {
        response = {
          success: false,
          message: "Não foi possível adicionar o gênero!",
          data: null,
        };

        res.status(StatusCodes.BAD_REQUEST).json(response);
        return;
      }

      response = {
        success: true,
        message: "Gênero adicionado com sucesso!",
        data: genre.id,
      };

      res.status(StatusCodes.CREATED).json(response);
      return;
    } catch (error) {
      next(error);
    }
  },

  // ==========================================================================
  get: async (req, res, next) => {
    let response: IResponse<IGenre | null> | null = null;
    try {
      const genreId = Number(req.params.id);

      if (isNaN(genreId)) {
        response = { success: false, message: "Invalid params", data: null };
        res.status(StatusCodes.BAD_REQUEST).json(response);
        return;
      }
      const genre = await prisma.genre.findUnique({
        where: {
          id: genreId,
        },
      });
      if (!genre) {
        response = {
          success: false,
          message: "Esse gênero não existe!",
          data: null,
        };
        res.status(StatusCodes.NOT_FOUND).json(response);
        return;
      }
      response = { success: true, message: "Gênero encontrado!", data: genre };
      res.status(StatusCodes.OK).json(response);
      return;
    } catch (error) {
      next(error);
    }
  },

  // ==========================================================================
  getAll: async (req, res, next) => {
    let response: IResponse<Array<IGenre> | null> | null = null;
    try {
      const genres = await prisma.genre.findMany();

      if (!genres || genres.length === 0) {
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
        message: "Gêneros encontrados!",
        data: genres,
      };
      res.status(StatusCodes.OK).json(response);
      return;
    } catch (error) {
      next(error);
    }
  },

  // ==========================================================================
  update: async (req, res, next) => {
    let response: IResponse<IGenre | null> | null = null;
    try {
      const data = genreSchema.parse(req.body);

      const existingGenre = await prisma.genre.findUnique({
        where: { id: Number(req.body.id) },
      });

      if (!existingGenre) {
        response = {
          success: false,
          message: "Esse gênero não existe!",
          data: null,
        };

        res.status(StatusCodes.BAD_REQUEST).json(response);
        return;
      }

      const genre = await prisma.genre.update({
        where: {
          id: Number(req.body.id),
        },
        data,
      });

      response = { success: true, message: "Gênero atualizado!", data: genre };
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
      const genreId = Number(req.params.id);

      if (isNaN(genreId)) {
        response = { success: false, message: "Invalid params", data: null };
        res.status(StatusCodes.BAD_REQUEST).json(response);
        return;
      }

      const existingGenre = await prisma.genre.findUnique({
        where: { id: Number(req.params.id) },
      });

      if (!existingGenre) {
        response = {
          success: false,
          message: "Esse gênero não existe!",
          data: null,
        };

        res.status(StatusCodes.BAD_REQUEST).json(response);
        return;
      }

      const data = await prisma.genre.delete({
        where: {
          id: Number(req.params.id),
        },
      });

      if (!data) {
        response = {
          success: false,
          message: "Esse gênero não existe!",
          data: null,
        };

        res.status(StatusCodes.NO_CONTENT).json(response);
        return;
      }

      response = { success: true, message: "Gênero deletado!", data: true };
      res.status(StatusCodes.OK).json(response);
      return;
    } catch (error) {
      next(error);
    }
  },
};

export default genreController;
