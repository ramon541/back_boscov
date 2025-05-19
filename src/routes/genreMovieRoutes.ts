import express from "express";
import genreMovieController from "../controller/genreMovieController";
const genreMovieRoutes = express.Router();

/**
 * @swagger
 * tags:
 *   name: Gênero de Filme
 *   description: Endpoints para gerenciar o vínculo entre gêneros e filmes
 */

/**
 * @swagger
 * /api/genreMovie:
 *   post:
 *     tags:
 *       - Gênero de Filme
 *     summary: Adiciona um novo gênero a um filme
 *     description: Cria um vínculo entre um gênero e um filme
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               genreId:
 *                 type: integer
 *                 description: ID do gênero
 *                 example: 2
 *               movieId:
 *                 type: integer
 *                 description: ID do filme
 *                 example: 5
 *     responses:
 *       201:
 *         description: Gênero do filme adicionado com sucesso
 *       400:
 *         description: Não foi possível adicionar o gênero ao filme
 *       500:
 *         description: Erro interno do servidor
 */
genreMovieRoutes.post("/genreMovie", genreMovieController.create);

/**
 * @swagger
 * /api/genreMovie/{id}:
 *   get:
 *     tags:
 *       - Gênero de Filme
 *     summary: Busca um gênero de filme por ID
 *     description: Retorna os dados do gênero de filme correspondente ao ID fornecido
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do gênero de filme
 *     responses:
 *       200:
 *         description: Gênero do filme encontrado
 *       400:
 *         description: Parâmetro inválido
 *       404:
 *         description: Gênero do filme não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
genreMovieRoutes.get("/genreMovie/:id", genreMovieController.get);

/**
 * @swagger
 * /api/genreMovies:
 *   get:
 *     tags:
 *       - Gênero de Filme
 *     summary: Lista todos os gêneros de filmes
 *     description: Retorna uma lista de todos os vínculos entre filmes e gêneros
 *     responses:
 *       200:
 *         description: Gêneros dos filmes encontrados
 *       204:
 *         description: Nenhum dado encontrado
 *       500:
 *         description: Erro interno do servidor
 */
genreMovieRoutes.get("/genreMovies", genreMovieController.getAll);

/**
 * @swagger
 * /api/genreMovie:
 *   put:
 *     tags:
 *       - Gênero de Filme
 *     summary: Atualiza um gênero de filme
 *     description: Atualiza o vínculo entre um gênero e um filme
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID do gênero do filme
 *                 example: 1
 *               genreId:
 *                 type: integer
 *                 description: ID do gênero
 *                 example: 3
 *               movieId:
 *                 type: integer
 *                 description: ID do filme
 *                 example: 7
 *     responses:
 *       200:
 *         description: Gênero do filme atualizado
 *       400:
 *         description: Gênero do filme não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
genreMovieRoutes.put("/genreMovie", genreMovieController.update);

/**
 * @swagger
 * /api/genreMovie/{id}:
 *   delete:
 *     tags:
 *       - Gênero de Filme
 *     summary: Deleta um gênero de filme
 *     description: Remove o vínculo entre um gênero e um filme
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do gênero do filme
 *     responses:
 *       200:
 *         description: Gênero do filme deletado
 *       400:
 *         description: Gênero do filme não encontrado ou parâmetro inválido
 *       204:
 *         description: Nenhum dado encontrado para deletar
 *       500:
 *         description: Erro interno do servidor
 */
genreMovieRoutes.delete("/genreMovie/:id", genreMovieController.delete);

export default genreMovieRoutes;
