import express, { RequestHandler } from "express";
import movieController from "../controller/movieController";
const movieRoutes = express.Router();

// Wrapper para converter os métodos do controlador para o tipo RequestHandler que o Express espera
const adaptRoute = (handler: Function): RequestHandler => {
  return (req, res, next) => {
    return Promise.resolve(handler(req, res, next))
      .catch(next);
  };
};

/**
 * @swagger
 * /api/movie:
 *   post:
 *     summary: Criar um novo filme
 *     tags: [Movies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - director
 *               - releaseYear
 *               - genreId
 *               - duration
 *               - classification
 *             properties:
 *               name:
 *                 type: string
 *               director:
 *                 type: string
 *               releaseYear:
 *                 type: string
 *                 format: date
 *               genreId:
 *                 type: integer
 *               duration:
 *                 type: string
 *               production:
 *                 type: string
 *               classification:
 *                 type: integer
 *               poster:
 *                 type: string
 *               additionalGenres:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       201:
 *         description: Filme criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro interno do servidor
 */
movieRoutes.post("/movie", adaptRoute(movieController.createMovie));

/**
 * @swagger
 * /api/movie/{id}:
 *   get:
 *     summary: Obter filme pelo ID
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do filme
 *     responses:
 *       200:
 *         description: Filme encontrado
 *       404:
 *         description: Filme não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
movieRoutes.get("/movie/:id", adaptRoute(movieController.getMovie));

/**
 * @swagger
 * /api/movies:
 *   get:
 *     summary: Listar todos os filmes
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: Lista de filmes
 *       500:
 *         description: Erro interno do servidor
 */
movieRoutes.get("/movies", adaptRoute(movieController.getAllMovies));

/**
 * @swagger
 * /api/movie:
 *   put:
 *     summary: Atualizar filme
 *     tags: [Movies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: integer
 *               name:
 *                 type: string
 *               director:
 *                 type: string
 *               releaseYear:
 *                 type: string
 *                 format: date
 *               genreId:
 *                 type: integer
 *               duration:
 *                 type: string
 *               production:
 *                 type: string
 *               classification:
 *                 type: integer
 *               poster:
 *                 type: string
 *               additionalGenres:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Filme atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Filme não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
movieRoutes.put("/movie", adaptRoute(movieController.updateMovie));

/**
 * @swagger
 * /api/movie/{id}:
 *   delete:
 *     summary: Excluir filme
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do filme
 *     responses:
 *       200:
 *         description: Filme excluído com sucesso
 *       404:
 *         description: Filme não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
movieRoutes.delete("/movie/:id", adaptRoute(movieController.deleteMovie));

/**
 * @swagger
 * /api/movies/genre/{genreId}:
 *   get:
 *     summary: Listar filmes por gênero
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: genreId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do gênero
 *     responses:
 *       200:
 *         description: Lista de filmes do gênero especificado
 *       400:
 *         description: ID de gênero inválido
 *       500:
 *         description: Erro interno do servidor
 */
movieRoutes.get("/movies/genre/:genreId", adaptRoute(movieController.getMoviesByGenre));

export default movieRoutes;