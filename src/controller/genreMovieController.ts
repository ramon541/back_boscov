import { StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction } from "express";

import genreMovieSchema, { IGenreMovie } from "../models/genreMovie";
import { IApiController, IResponse } from "../interfaces";
import prisma from "../../prisma/prismaClient";

export type IApiGenreMovieController = IApiController<IGenreMovie>;

const genreMovieController: IApiGenreMovieController = {} as const;

export default genreMovieController;
