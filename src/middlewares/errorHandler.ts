import { ZodError } from "zod";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof ZodError) {
    const messages = err.errors.map((e) => e.message);
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: messages,
      data: null,
    });
  }

  const message = err instanceof Error ? err.message : "Erro desconhecido";
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: `Erro interno do servidor: ${message}`,
    data: null,
  });
}

export default errorHandler;
