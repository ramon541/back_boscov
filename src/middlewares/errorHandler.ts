import { ZodError } from "zod";
import { StatusCodes } from "http-status-codes";

export default function errorHandler(err, req, res, next) {
  if (err instanceof ZodError) {
    const messages = err.errors.map((e) => e.message);
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: messages,
      data: null,
    });
  }

  const message = err instanceof Error ? err.message : "Erro desconhecido";
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: `Erro interno do servidor: ${message}`,
    data: null,
  });
}
