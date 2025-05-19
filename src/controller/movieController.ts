import { StatusCodes } from "http-status-codes";

import movieSchema, { IMovie } from "../models/movie";
import { IApiController, IResponse } from "../interfaces";
import prisma from "../../prisma/prismaClient";

export type IApiMovieController = IApiController<IMovie>;

const movieController: IApiMovieController = {
  create: async (req, res, next) => {
    let response: IResponse<number | null> | null = null;

    try {
      const data = movieSchema.parse(req.body);

      if (data.releaseYear) {
        const year = Number(data.releaseYear);
        if (isNaN(year) || year < 1000 || year > new Date().getFullYear()) {
          response = {
            success: false,
            message: "Invalid releaseYear provided!",
            data: null,
          };
          res.status(StatusCodes.BAD_REQUEST).json(response);
          return;
        }
      }
      console.log(data);
      const movie = await prisma.movie.create({
        data,
      });

      if (!movie) {
        response = {
          success: false,
          message: "Movie not created!",
          data: null,
        };

        res.status(StatusCodes.BAD_REQUEST).json(response);
        return;
      }

      response = {
        success: true,
        message: "Movie created!",
        data: movie.id,
      };

      res.status(StatusCodes.CREATED).json(response);
      return;
    } catch (error) {
      next(error);
    }
  },

  // ==========================================================================
  get: async (req, res, next) => {
    let response: IResponse<IMovie | null> | null = null;

    try {
      const movieId = Number(req.params.id);

      if (isNaN(movieId)) {
        response = { success: false, message: "Invalid params", data: null };
        res.status(StatusCodes.BAD_REQUEST).json(response);
        return;
      }
      const movie = await prisma.movie.findUnique({
        where: {
          id: movieId,
        },
      });
      if (!movie) {
        response = {
          success: false,
          message: "Movie doesn't exist!",
          data: null,
        };
        res.status(StatusCodes.NOT_FOUND).json(response);
        return;
      }
      response = { success: true, message: "Movie found!", data: movie };
      res.status(StatusCodes.OK).json(response);
      return;
    } catch (error) {
      next(error);
    }
  },

  // ==========================================================================
  getAll: async (req, res, next) => {
    let response: IResponse<Array<IMovie> | null> | null = null;

    try {
      const movies = await prisma.movie.findMany();

      if (!movies || movies.length === 0) {
        response = {
          success: true,
          message: "Database is empty!",
          data: [],
        };

        res.status(StatusCodes.NO_CONTENT).json(response);
        return;
      }

      response = { success: true, message: "Movies found!", data: movies };
      res.status(StatusCodes.OK).json(response);
      return;
    } catch (error) {
      next(error);
    }
  },

  // ==========================================================================
  update: async (req, res, next) => {
    let response: IResponse<IMovie | null> | null = null;
    try {
      const data = movieSchema.parse(req.body);

      const existingMovie = await prisma.movie.findUnique({
        where: { id: Number(req.body.id) },
      });

      if (!existingMovie) {
        response = {
          success: false,
          message: "Movie doesn't exist!",
          data: null,
        };

        res.status(StatusCodes.BAD_REQUEST).json(response);
        return;
      }

      const movie = await prisma.movie.update({
        where: {
          id: Number(req.body.id),
        },
        data,
      });

      response = { success: true, message: "Movie updated!", data: movie };
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
      const movieId = Number(req.params.id);

      if (isNaN(movieId)) {
        response = { success: false, message: "Invalid params", data: null };
        res.status(StatusCodes.BAD_REQUEST).json(response);
        return;
      }

      const existingMovie = await prisma.movie.findUnique({
        where: { id: Number(req.params.id) },
      });

      if (!existingMovie) {
        response = {
          success: false,
          message: "Movie doesn't exist!",
          data: null,
        };

        res.status(StatusCodes.BAD_REQUEST).json(response);
        return;
      }

      const data = await prisma.movie.delete({
        where: {
          id: Number(req.params.id),
        },
      });

      if (!data) {
        response = {
          success: false,
          message: "Movie doesn't exist!",
          data: null,
        };

        res.status(StatusCodes.NO_CONTENT).json(response);
        return;
      }

      response = { success: true, message: "Movie deleted!", data: true };
      res.status(StatusCodes.OK).json(response);
      return;
    } catch (error) {
      next(error);
    }
  },
};

export default movieController;
