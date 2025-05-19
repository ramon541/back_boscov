import { StatusCodes } from "http-status-codes";

import reviewSchema, { IReview } from "../models/review";
import { IApiController, IResponse } from "../interfaces";
import prisma from "../../prisma/prismaClient";

export type IApiReviewController = IApiController<IReview>;

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
          message: "Review not created!",
          data: null,
        };

        res.status(StatusCodes.BAD_REQUEST).json(response);
        return;
      }

      response = {
        success: true,
        message: "Review created!",
        data: review.id,
      };

      res.status(StatusCodes.CREATED).json(response);
      return;
    } catch (error) {
      next(error);
    }
  },

  // ==========================================================================
  get: async (req, res, next) => {
    let response: IResponse<IReview | null> | null = null;

    try {
      const reviewId = Number(req.params.id);

      if (isNaN(reviewId)) {
        response = { success: false, message: "Invalid params", data: null };
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
          message: "Review doesn't exist!",
          data: null,
        };
        res.status(StatusCodes.NOT_FOUND).json(response);
        return;
      }
      response = { success: true, message: "Review found!", data: review };
      res.status(StatusCodes.OK).json(response);
      return;
    } catch (error) {
      next(error);
    }
  },

  // ==========================================================================
  getAll: async (req, res, next) => {
    let response: IResponse<Array<IReview> | null> | null = null;

    try {
      const reviews = await prisma.review.findMany();

      if (!reviews || reviews.length === 0) {
        response = {
          success: true,
          message: "Database is empty!",
          data: [],
        };

        res.status(StatusCodes.NO_CONTENT).json(response);
        return;
      }

      response = { success: true, message: "Reviews found!", data: reviews };
      res.status(StatusCodes.OK).json(response);
      return;
    } catch (error) {
      next(error);
    }
  },

  // ==========================================================================
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
          message: "Review doesn't exist!",
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

      response = { success: true, message: "Review updated!", data: review };
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
      const reviewId = Number(req.params.id);

      if (isNaN(reviewId)) {
        response = { success: false, message: "Invalid params", data: null };
        res.status(StatusCodes.BAD_REQUEST).json(response);
        return;
      }

      const existingReview = await prisma.review.findUnique({
        where: { id: Number(req.params.id) },
      });

      if (!existingReview) {
        response = {
          success: false,
          message: "Review doesn't exist!",
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
          message: "Review doesn't exist!",
          data: null,
        };

        res.status(StatusCodes.NO_CONTENT).json(response);
        return;
      }

      response = { success: true, message: "Review deleted!", data: true };
      res.status(StatusCodes.OK).json(response);
      return;
    } catch (error) {
      next(error);
    }
  },
};

export default reviewController;
