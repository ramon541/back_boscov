import { ZodError } from "zod";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

async function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof ZodError) {
    const messages = err.errors.map((e) => e.path.join(".") + ": " + e.message);
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: messages,
      data: null,
    });
    return;
  }

  const message = err instanceof Error ? err.message : "Erro desconhecido";
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: `Erro interno do servidor: ${message}`,
    data: null,
  });
  return;
}

export default errorHandler;
