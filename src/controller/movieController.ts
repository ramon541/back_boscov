import { PrismaClient } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import { IResponse } from '../interfaces';
import { z, ZodError } from 'zod';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

const prisma = new PrismaClient();

// Esquema para validação de filme
const movieSchema = z.object({
  name: z.string().min(1, "Nome do filme é obrigatório"),
  director: z.string().min(1, "Diretor é obrigatório"),
  releaseYear: z.string().or(z.date()),
  genreId: z.number().int().positive("ID do gênero principal é obrigatório"),
  duration: z.string().min(1, "Duração é obrigatória"),
  production: z.string().optional(),
  classification: z.number().int().min(0, "Classificação deve ser um número positivo"),
  poster: z.string().optional()
});

export interface IMovie {
  id?: number;
  name: string;
  director: string;
  releaseYear: Date;
  genreId: number;
  duration: string;
  production?: string;
  classification: number;
  poster?: string;
}

export interface IMovieController {
  createMovie: (req: Request, res: Response) => Promise<Response>;
  getMovie: (req: Request, res: Response) => Promise<Response>;
  getAllMovies: (req: Request, res: Response) => Promise<Response>;
  updateMovie: (req: Request, res: Response) => Promise<Response>;
  deleteMovie: (req: Request, res: Response) => Promise<Response>;
  getMoviesByGenre: (req: Request, res: Response) => Promise<Response>;
}

// Funções utilitárias - Programação Funcional
const createErrorResponse = (message: string | string[], data: any = null): IResponse<any> => ({
  success: false,
  message,
  data
});

const createSuccessResponse = <T>(message: string, data: T): IResponse<T> => ({
  success: true,
  message,
  data
});

const handleZodError = (error: ZodError, res: Response): Response => {
  const zodErrors = error.errors.map(err => err.message);
  return res
    .status(StatusCodes.BAD_REQUEST)
    .json(createErrorResponse(zodErrors));
};

const handleGenericError = (error: Error, res: Response): Response => {
  const errorMessage = error.message || "Unknown error";
  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json(createErrorResponse(`Erro interno do servidor: ${errorMessage}`));
};

// Função para calcular a média de avaliações
const calculateAverageRating = (reviews: { rating: number }[]): number => {
  if (reviews.length === 0) return 0;
  return reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
};

// Definições de interfaces para tipagem de parâmetros
interface MovieParams {
  id: string;
}

interface GenreParams {
  genreId: string;
}

const movieController: IMovieController = {
  createMovie: async (req, res) => {
    try {
      const data = movieSchema.parse({
        ...req.body,
        releaseYear: new Date(req.body.releaseYear)
      });

      const movie = await prisma.movie.create({
        data: {
          ...data,
          releaseYear: new Date(data.releaseYear)
        }
      });

      // Se houver gêneros adicionais, adicioná-los ao filme
      if (req.body.additionalGenres && Array.isArray(req.body.additionalGenres)) {
        await Promise.all(
          req.body.additionalGenres.map((genreId: number | string) => 
            prisma.genreMovie.create({
              data: {
                movieId: movie.id,
                genreId: Number(genreId)
              }
            })
          )
        );
      }

      return res
        .status(StatusCodes.CREATED)
        .json(createSuccessResponse("Filme criado com sucesso!", movie.id));
      
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      return handleGenericError(error as Error, res);
    }
  },

  getMovie: async (req, res) => {
    try {
      const movieId = Number(req.params.id);

      if (isNaN(movieId)) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json(createErrorResponse("Parâmetros inválidos"));
      }

      const movie = await prisma.movie.findUnique({
        where: { id: movieId },
        include: {
          genre: true,
          genres: {
            include: {
              genre: true
            }
          },
          reviews: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  nickname: true
                }
              }
            }
          }
        }
      });

      if (!movie) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json(createErrorResponse("Filme não encontrado!"));
      }

      // Transformar os dados para melhor formato usando composição funcional
      const formattedMovie = {
        ...movie,
        averageRating: calculateAverageRating(movie.reviews),
        genres: [
          movie.genre,
          ...movie.genres.map(g => g.genre)
        ]
      };

      return res
        .status(StatusCodes.OK)
        .json(createSuccessResponse("Filme encontrado!", formattedMovie));
      
    } catch (error) {
      return handleGenericError(error as Error, res);
    }
  },

  getAllMovies: async (req, res) => {
    try {
      const movies = await prisma.movie.findMany({
        include: {
          genre: true,
          reviews: true
        }
      });

      // Usar map para transformar dados (abordagem funcional)
      const moviesWithRatings = movies.map(movie => ({
        ...movie,
        averageRating: calculateAverageRating(movie.reviews)
      }));

      return res
        .status(StatusCodes.OK)
        .json(createSuccessResponse("Filmes encontrados!", moviesWithRatings));
      
    } catch (error) {
      return handleGenericError(error as Error, res);
    }
  },

  updateMovie: async (req, res) => {
    try {
      const movieId = Number(req.body.id);
      
      if (!movieId || isNaN(movieId)) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json(createErrorResponse("ID do filme é obrigatório"));
      }

      const data = movieSchema.parse({
        ...req.body,
        releaseYear: new Date(req.body.releaseYear)
      });

      const movie = await prisma.movie.update({
        where: { id: movieId },
        data: {
          ...data,
          releaseYear: new Date(data.releaseYear)
        },
      });

      // Atualizar gêneros adicionais usando transações para garantir atomicidade
      if (req.body.additionalGenres && Array.isArray(req.body.additionalGenres)) {
        // Usar transação para garantir consistência
        await prisma.$transaction([
          // Remover relações existentes
          prisma.genreMovie.deleteMany({
            where: { movieId }
          }),
          
          // Adicionar novas relações (usando uma query única para melhor performance)
          ...req.body.additionalGenres.map((genreId: number | string) => 
            prisma.genreMovie.create({
              data: {
                movieId,
                genreId: Number(genreId)
              }
            })
          )
        ]);
      }

      return res
        .status(StatusCodes.OK)
        .json(createSuccessResponse("Filme atualizado!", movie));
      
    } catch (error) {
      if (error instanceof ZodError) {
        return handleZodError(error, res);
      }
      
      // Tratar erro de filme não encontrado
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json(createErrorResponse("Filme não encontrado"));
      }
      
      return handleGenericError(error as Error, res);
    }
  },

  deleteMovie: async (req, res) => {
    try {
      const movieId = Number(req.params.id);

      if (isNaN(movieId)) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json(createErrorResponse("Parâmetros inválidos"));
      }

      // Usar transação para garantir que todas as operações sejam executadas ou nenhuma
      await prisma.$transaction([
        // Remover relações primeiro
        prisma.review.deleteMany({
          where: { movieId }
        }),
        prisma.genreMovie.deleteMany({
          where: { movieId }
        }),
        // Por fim, remover o filme
        prisma.movie.delete({
          where: { id: movieId }
        })
      ]);

      return res
        .status(StatusCodes.OK)
        .json(createSuccessResponse("Filme excluído com sucesso!", true));
      
    } catch (error) {
      // Tratar erro de filme não encontrado
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json(createErrorResponse("Filme não encontrado"));
      }
      
      return handleGenericError(error as Error, res);
    }
  },

  getMoviesByGenre: async (req, res) => {
    try {
      // Use string indexing em vez de converter o tipo diretamente
      const genreIdParam = req.params['genreId'];
      const genreIdNumber = Number(genreIdParam);

      if (isNaN(genreIdNumber)) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json(createErrorResponse("Parâmetros inválidos"));
      }

      // Executar as consultas em paralelo para melhor performance
      const [moviesByMainGenre, moviesBySecondaryGenre] = await Promise.all([
        // Buscar filmes pelo gênero principal
        prisma.movie.findMany({
          where: { genreId: genreIdNumber },
          include: {
            genre: true,
            reviews: true
          }
        }),
        
        // Buscar filmes por gêneros secundários
        prisma.genreMovie.findMany({
          where: { genreId: genreIdNumber },
          select: {
            movie: {
              include: {
                genre: true,
                reviews: true
              }
            }
          }
        })
      ]);

      // Usando Set para remover duplicatas de forma eficiente
      const mainGenreIds = new Set(moviesByMainGenre.map(movie => movie.id));
      
      // Usando programação funcional para combinar resultados
      const secondaryMovies = moviesBySecondaryGenre
        .map(item => item.movie)
        .filter(movie => !mainGenreIds.has(movie.id));
      
      const allMovies = [...moviesByMainGenre, ...secondaryMovies];

      // Map para calcular avaliações (abordagem funcional)
      const moviesWithRatings = allMovies.map(movie => ({
        ...movie,
        averageRating: calculateAverageRating(movie.reviews)
      }));

      return res
        .status(StatusCodes.OK)
        .json(createSuccessResponse("Filmes encontrados por gênero!", moviesWithRatings));
      
    } catch (error) {
      return handleGenericError(error as Error, res);
    }
  }
};

export default movieController;