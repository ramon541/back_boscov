import express from 'express';
import reviewController from '../controller/reviewController';
import { isAdmin, verifyToken } from '../middlewares';
const reviewRoutes = express.Router();

/**
 * @swagger
 * tags:
 *   name: Avaliações
 *   description: Endpoints para gerenciar avaliações
 */

/**
 * @swagger
 * /api/review:
 *   post:
 *     tags:
 *       - Avaliações
 *     summary: Cria uma nova avaliação
 *     description: Cria uma nova avaliação com os dados fornecidos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: ID do usuário
 *                 example: 1
 *               movieId:
 *                 type: integer
 *                 description: ID do filme
 *                 example: 10
 *               rating:
 *                 type: number
 *                 description: Nota da avaliação (de 0 a 5, passos de 0.5)
 *                 example: 4.5
 *               comment:
 *                 type: string
 *                 description: Comentário da avaliação (opcional)
 *                 example: Ótimo filme!
 *     responses:
 *       201:
 *         description: Avaliação adicionada com sucesso
 *       400:
 *         description: Dados inválidos ou avaliação não pôde ser criada
 *       500:
 *         description: Erro interno do servidor
 */
reviewRoutes.post('/review', [verifyToken], reviewController.create);

/**
 * @swagger
 * /api/review/{id}:
 *   get:
 *     tags:
 *       - Avaliações
 *     summary: Retorna uma avaliação pelo ID
 *     description: Retorna os dados de uma avaliação específica
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da avaliação
 *         example: 1
 *     responses:
 *       200:
 *         description: Avaliação encontrada com sucesso
 *       400:
 *         description: Parâmetro inválido
 *       404:
 *         description: Avaliação não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
reviewRoutes.get('/review/:id', [verifyToken], reviewController.get);

/**
 * @swagger
 * /api/reviews:
 *   get:
 *     tags:
 *       - Avaliações
 *     summary: Lista todas as avaliações
 *     description: Retorna uma lista com todas as avaliações cadastradas
 *     responses:
 *       200:
 *         description: Avaliações encontradas
 *       204:
 *         description: Nenhuma avaliação encontrada
 *       500:
 *         description: Erro interno do servidor
 */
reviewRoutes.get('/reviews', [verifyToken], reviewController.getAll);
reviewRoutes.get(
    '/reviews/movie/:movieId',
    [verifyToken],
    reviewController.getAllReviewsByMovieId
);
reviewRoutes.get(
    '/reviews/movie/:movieId/user/:userId',
    [verifyToken],
    reviewController.getUserReviewByMovieId
);

/**
 * @swagger
 * /api/review:
 *   put:
 *     tags:
 *       - Avaliações
 *     summary: Atualiza uma avaliação existente
 *     description: Atualiza os dados de uma avaliação existente pelo ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID da avaliação
 *                 example: 1
 *               userId:
 *                 type: integer
 *                 description: ID do usuário
 *                 example: 1
 *               movieId:
 *                 type: integer
 *                 description: ID do filme
 *                 example: 10
 *               rating:
 *                 type: number
 *                 description: Nota da avaliação (de 0 a 5, passos de 0.5)
 *                 example: 3.5
 *               comment:
 *                 type: string
 *                 description: Comentário da avaliação (opcional)
 *                 example: Filme razoável
 *     responses:
 *       200:
 *         description: Avaliação atualizada com sucesso
 *       400:
 *         description: Dados inválidos ou avaliação não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
reviewRoutes.put('/review', [verifyToken], reviewController.update);

/**
 * @swagger
 * /api/review/{id}:
 *   delete:
 *     tags:
 *       - Avaliações
 *     summary: Deleta uma avaliação
 *     description: Remove uma avaliação existente pelo ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da avaliação
 *         example: 1
 *     responses:
 *       200:
 *         description: Avaliação deletada com sucesso
 *       400:
 *         description: Parâmetro inválido ou avaliação não encontrada
 *       204:
 *         description: Avaliação não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
reviewRoutes.delete('/review/:id', [verifyToken], reviewController.delete);

export default reviewRoutes;
