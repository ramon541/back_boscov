import { StatusCodes } from 'http-status-codes';

import movieSchema, { IMovie } from '../models/movie';
import prisma from '../../prisma/prismaClient';
import { RequestHandler } from 'express';

export type IApiMovieController = IApiController<RequestHandler>;

const movieController: IApiMovieController = {
    create: async (req, res, next) => {
        let response: IResponse<number | null> | null = null;

        try {
            const data = movieSchema.parse(req.body);

            const movie = await prisma.movie.create({
                data,
            });

            if (!movie) {
                response = {
                    success: false,
                    message: 'Não foi possível adicionar o filme!',
                    data: null,
                };

                res.status(StatusCodes.BAD_REQUEST).json(response);
                return;
            }

            response = {
                success: true,
                message: 'Filme adicionado com sucesso!',
                data: movie.id,
            };

            res.status(StatusCodes.CREATED).json(response);
            return;
        } catch (error) {
            next(error);
        }
    },

    //= =================================================================================
    get: async (req, res, next) => {
        let response: IResponse<IMovie | null> | null = null;

        try {
            const movieId = Number(req.params.id);

            if (isNaN(movieId)) {
                response = {
                    success: false,
                    message: 'Invalid params',
                    data: null,
                };
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
                    message: 'Esse filme não existe!',
                    data: null,
                };
                res.status(StatusCodes.NOT_FOUND).json(response);
                return;
            }
            response = {
                success: true,
                message: 'Filme encontrado!',
                data: movie,
            };
            res.status(StatusCodes.OK).json(response);
            return;
        } catch (error) {
            next(error);
        }
    },

    //= =================================================================================
    getAll: async (req, res, next) => {
        let response: IResponse<Array<IMovie> | null> | null = null;

        try {
            const movies = await prisma.movie.findMany();

            if (!movies || movies.length === 0) {
                response = {
                    success: true,
                    message: 'Database is empty!',
                    data: [],
                };

                res.status(StatusCodes.NO_CONTENT).json(response);
                return;
            }

            response = {
                success: true,
                message: 'Filmes encontrados!',
                data: movies,
            };
            res.status(StatusCodes.OK).json(response);
            return;
        } catch (error) {
            next(error);
        }
    },

    //= =================================================================================
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
                    message: 'Esse filme não existe!',
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

            response = {
                success: true,
                message: 'Filme atualizado!',
                data: movie,
            };
            res.status(StatusCodes.OK).json(response);
            return;
        } catch (error) {
            next(error);
        }
    },

    //= =================================================================================
    delete: async (req, res, next) => {
        let response: IResponse<boolean | null> | null = null;

        try {
            const movieId = Number(req.params.id);

            if (isNaN(movieId)) {
                response = {
                    success: false,
                    message: 'Invalid params',
                    data: null,
                };
                res.status(StatusCodes.BAD_REQUEST).json(response);
                return;
            }

            const existingMovie = await prisma.movie.findUnique({
                where: { id: Number(req.params.id) },
            });

            if (!existingMovie) {
                response = {
                    success: false,
                    message: 'Esse filme não existe!',
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
                    message: 'Esse filme não existe!',
                    data: null,
                };

                res.status(StatusCodes.NO_CONTENT).json(response);
                return;
            }

            response = {
                success: true,
                message: 'Filme deletado!',
                data: true,
            };
            res.status(StatusCodes.OK).json(response);
            return;
        } catch (error) {
            next(error);
        }
    },
};

export default movieController;
