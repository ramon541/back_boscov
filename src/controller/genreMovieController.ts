import { StatusCodes } from "http-status-codes";

import genreMovieSchema, { IGenreMovie } from "../models/genreMovie";
import { IApiController, IResponse } from "../interfaces";
import prisma from "../../prisma/prismaClient";

export type IApiGenreMovieController = IApiController<IGenreMovie>;

const genreMovieController: IApiGenreMovieController = {
  create: async (req, res, next) => {
    let response: IResponse<number | null> | null = null;
    try {
      const data = genreMovieSchema.parse(req.body);

      const genreMovie = await prisma.genreMovie.create({
        data,
      });

      if (!genreMovie) {
        response = {
          success: false,
          message: "Genre Movie not created!",
          data: null,
        };

        res.status(StatusCodes.BAD_REQUEST).json(response);
        return;
      }

      response = {
        success: true,
        message: "Genre Movie created!",
        data: genreMovie.id,
      };

      res.status(StatusCodes.CREATED).json(response);
      return;
    } catch (error) {
      next(error);
    }
  },

  // ==========================================================================
  get: async (req, res, next) => {
    let response: IResponse<IGenreMovie | null> | null = null;
    try {
      const genreMovieId = Number(req.params.id);

      if (isNaN(genreMovieId)) {
        response = { success: false, message: "Invalid params", data: null };
        res.status(StatusCodes.BAD_REQUEST).json(response);
        return;
      }
      const genreMovie = await prisma.genreMovie.findUnique({
        where: {
          id: genreMovieId,
        },
      });
      if (!genreMovie) {
        response = {
          success: true,
          message: "Genre Movie doesn't exist!",
          data: null,
        };
        res.status(StatusCodes.NOT_FOUND).json(response);
        return;
      }
      response = {
        success: true,
        message: "Genre Movie found!",
        data: genreMovie,
      };
      res.status(StatusCodes.OK).json(response);
      return;
    } catch (error) {
      next(error);
    }
  },

  // ==========================================================================
  getAll: async (req, res, next) => {
    let response: IResponse<Array<IGenreMovie> | null> | null = null;
    try {
      const genreMovies = await prisma.genreMovie.findMany();

      if (!genreMovies || genreMovies.length === 0) {
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
        message: "Genre Movies found!",
        data: genreMovies,
      };
      res.status(StatusCodes.OK).json(response);
      return;
    } catch (error) {
      next(error);
    }
  },

  // ==========================================================================
  update: async (req, res, next) => {
    let response: IResponse<IGenreMovie | null> | null = null;
    try {
      const data = genreMovieSchema.parse(req.body);

      const existingGenreMovie = await prisma.genreMovie.findUnique({
        where: { id: Number(req.body.id) },
      });

      if (!existingGenreMovie) {
        response = {
          success: false,
          message: "Genre Movie doesn't exist!",
          data: null,
        };

        res.status(StatusCodes.BAD_REQUEST).json(response);
        return;
      }

      const genreMovie = await prisma.genreMovie.update({
        where: {
          id: Number(req.body.id),
        },
        data,
      });

      response = {
        success: true,
        message: "Genre Movie updated!",
        data: genreMovie,
      };
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
      const genreMovieId = Number(req.params.id);

      if (isNaN(genreMovieId)) {
        response = { success: false, message: "Invalid params", data: null };
        res.status(StatusCodes.BAD_REQUEST).json(response);
        return;
      }

      const existingGenreMovie = await prisma.genreMovie.findUnique({
        where: { id: Number(req.params.id) },
      });

      if (!existingGenreMovie) {
        response = {
          success: false,
          message: "Genre Movie doesn't exist!",
          data: null,
        };

        res.status(StatusCodes.BAD_REQUEST).json(response);
        return;
      }

      const data = await prisma.genreMovie.delete({
        where: {
          id: Number(req.params.id),
        },
      });

      if (!data) {
        response = {
          success: false,
          message: "Genre doesn't exist!",
          data: null,
        };

        res.status(StatusCodes.NO_CONTENT).json(response);
        return;
      }

      response = { success: true, message: "Genre deleted!", data: true };
      res.status(StatusCodes.OK).json(response);
      return;
    } catch (error) {
      next(error);
    }
  },
};

export default genreMovieController;
