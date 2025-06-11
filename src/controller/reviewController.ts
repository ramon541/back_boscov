import { StatusCodes } from 'http-status-codes';

import reviewSchema, { IReview, reviewParamsSchema } from '../models/review';
import prisma from '../../prisma/prismaClient';
import { RequestHandler } from 'express';

export type IApiReviewController = IReviewController<RequestHandler>;

const reviewController: IApiReviewController = {
    create: async (req, res, next) => {
        let response: IResponse<number | null> | null = null;

        try {
            const data = reviewSchema.parse(req.body);

            const review = await prisma.review.create({
                data,
            });

            if (!review) {
                response = {
                    success: false,
                    message: 'Não foi possível adicionar a avaliação!',
                    data: null,
                };

                res.status(StatusCodes.BAD_REQUEST).json(response);
                return;
            }

            response = {
                success: true,
                message: 'Avaliação adicionada com sucesso!',
                data: review.id,
            };

            res.status(StatusCodes.CREATED).json(response);
            return;
        } catch (error) {
            next(error);
        }
    },

    //= =================================================================================
    get: async (req, res, next) => {
        let response: IResponse<IReview | null> | null = null;

        try {
            const reviewId = Number(req.params.id);

            if (isNaN(reviewId)) {
                response = {
                    success: false,
                    message: 'Invalid params',
                    data: null,
                };
                res.status(StatusCodes.BAD_REQUEST).json(response);
                return;
            }
            const review = await prisma.review.findUnique({
                where: {
                    id: reviewId,
                },
            });
            if (!review) {
                response = {
                    success: false,
                    message: 'Essa avaliação não existe!',
                    data: null,
                };
                res.status(StatusCodes.NOT_FOUND).json(response);
                return;
            }
            response = {
                success: true,
                message: 'Avaliação encontrada!',
                data: review,
            };
            res.status(StatusCodes.OK).json(response);
            return;
        } catch (error) {
            next(error);
        }
    },

    //= =================================================================================
    getAll: async (req, res, next) => {
        let response: IResponse<Array<IReview> | null> | null = null;

        try {
            const reviews = await prisma.review.findMany();

            if (!reviews || reviews.length === 0) {
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
                message: 'Avaliações encontradas!',
                data: reviews,
            };
            res.status(StatusCodes.OK).json(response);
            return;
        } catch (error) {
            next(error);
        }
    },

    //= =================================================================================
    getAllReviewsByMovieId: async (req, res, next) => {
        let response: IResponse<Array<IReview> | null> | null = null;

        try {
            const parseResult = reviewParamsSchema
                .pick({ movieId: true })
                .safeParse({
                    movieId: Number(req.params.movieId),
                });

            if (!parseResult.success) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    message: 'Parâmetro inválido!',
                    errors: parseResult.error.format(),
                });
                return;
            }

            const { movieId } = parseResult.data;

            const reviews = await prisma.review.findMany({
                where: { movieId },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            });

            if (!reviews || reviews.length === 0) {
                response = {
                    success: true,
                    message: 'Nenhuma avaliação encontrada para este filme.',
                    data: [],
                };
                res.status(StatusCodes.NO_CONTENT).json(response);
                return;
            }

            response = {
                success: true,
                message: 'Avaliações encontradas!',
                data: reviews,
            };

            res.status(StatusCodes.OK).json(response);
            return;
        } catch (error) {
            next(error);
        }
    },

    //= =================================================================================
    getUserReviewByMovieId: async (req, res, next) => {
        let response: IResponse<IReview | null> | null = null;

        try {
            const parseResult = reviewParamsSchema.safeParse({
                movieId: Number(req.params.movieId),
                userId: Number(req.params.userId),
            });

            if (!parseResult.success) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    message: 'Parâmetros inválidos!',
                    errors: parseResult.error.format(),
                });
                return;
            }

            const { movieId, userId } = parseResult.data;

            const review = await prisma.review.findFirst({
                where: { movieId, userId },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            });

            if (!review) {
                response = {
                    success: true,
                    message:
                        'Nenhuma avaliação encontrada para este usuário neste filme.',
                    data: null,
                };
                res.status(StatusCodes.NO_CONTENT).json(response);
                return;
            }

            response = {
                success: true,
                message: 'Avaliação encontrada!',
                data: review,
            };

            res.status(StatusCodes.OK).json(response);
            return;
        } catch (error) {
            next(error);
        }
    },

    //= =================================================================================
    update: async (req, res, next) => {
        let response: IResponse<IReview | null> | null = null;
        try {
            const data = reviewSchema.parse(req.body);

            const existingReview = await prisma.review.findUnique({
                where: { id: Number(req.body.id) },
            });

            if (!existingReview) {
                response = {
                    success: false,
                    message: 'Essa avaliação não existe!',
                    data: null,
                };

                res.status(StatusCodes.BAD_REQUEST).json(response);
                return;
            }

            const review = await prisma.review.update({
                where: {
                    id: Number(req.body.id),
                },
                data,
            });

            response = {
                success: true,
                message: 'Avaliação atualizada!',
                data: review,
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
            const reviewId = Number(req.params.id);

            if (isNaN(reviewId)) {
                response = {
                    success: false,
                    message: 'Invalid params',
                    data: null,
                };
                res.status(StatusCodes.BAD_REQUEST).json(response);
                return;
            }

            const existingReview = await prisma.review.findUnique({
                where: { id: Number(req.params.id) },
            });

            if (!existingReview) {
                response = {
                    success: false,
                    message: 'Essa avaliação não existe!',
                    data: null,
                };

                res.status(StatusCodes.BAD_REQUEST).json(response);
                return;
            }

            const data = await prisma.review.delete({
                where: {
                    id: Number(req.params.id),
                },
            });

            if (!data) {
                response = {
                    success: false,
                    message: 'Essa avaliação não existe!',
                    data: null,
                };

                res.status(StatusCodes.NO_CONTENT).json(response);
                return;
            }

            response = {
                success: true,
                message: 'Avaliação deletada!',
                data: true,
            };
            res.status(StatusCodes.OK).json(response);
            return;
        } catch (error) {
            next(error);
        }
    },
};

export default reviewController;
