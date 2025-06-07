import express from 'express';
import movieController from '../controller/movieController';
const movieRoutes = express.Router();

/**
 * @swagger
 * tags:
 *   name: Filmes
 *   description: Endpoints para gerenciar filmes
 */

/**
 * @swagger
 * /api/movie:
 *   post:
 *     tags:
 *       - Filmes
 *     summary: Cria um novo filme
 *     description: Cria um novo filme com os dados fornecidos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome do filme
 *                 example: Matrix
 *               director:
 *                 type: string
 *                 description: Diretor do filme
 *                 example: Lana Wachowski
 *               releaseYear:
 *                 type: integer
 *                 description: Ano de lançamento do filme
 *                 example: 1999
 *               duration:
 *                 type: string
 *                 description: Duração do filme
 *                 example: 2h16min
 *               production:
 *                 type: string
 *                 description: Produtora do filme
 *                 example: Warner Bros.
 *               classification:
 *                 type: string
 *                 description: Classificação indicativa
 *                 enum: [C_L, C_10, C_12, C_14, C_16, C_18]
 *                 example: C_14
 *               poster:
 *                 type: string
 *                 format: uri
 *                 nullable: true
 *                 description: URL do cartaz do filme
 *                 example: https://exemplo.com/poster.jpg
 *     responses:
 *       201:
 *         description: Filme adicionado com sucesso
 *       400:
 *         description: Dados inválidos ou filme não foi adicionado
 *       500:
 *         description: Erro interno do servidor
 */
movieRoutes.post('/movie', movieController.create);

/**
 * @swagger
 * /api/movie/{id}:
 *   get:
 *     tags:
 *       - Filmes
 *     summary: Busca um filme por ID
 *     description: Retorna os dados de um filme específico
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do filme
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Filme encontrado
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Filme não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
movieRoutes.get('/movie/:id', movieController.get);

/**
 * @swagger
 * /api/movies:
 *   get:
 *     tags:
 *       - Filmes
 *     summary: Lista todos os filmes
 *     description: Retorna uma lista com todos os filmes cadastrados
 *     responses:
 *       200:
 *         description: Filmes encontrados
 *       204:
 *         description: Nenhum filme encontrado
 *       500:
 *         description: Erro interno do servidor
 */
movieRoutes.get('/movies', movieController.getAll);

/**
 * @swagger
 * /api/movie:
 *   put:
 *     tags:
 *       - Filmes
 *     summary: Atualiza um filme
 *     description: Atualiza os dados de um filme existente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id]
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID do filme a ser atualizado
 *                 example: 1
 *               name:
 *                 type: string
 *                 description: Nome do filme
 *                 example: Matrix Reloaded
 *               director:
 *                 type: string
 *                 description: Diretor do filme
 *                 example: Lana Wachowski
 *               releaseYear:
 *                 type: integer
 *                 description: Ano de lançamento
 *                 example: 2003
 *               duration:
 *                 type: string
 *                 description: Duração do filme
 *                 example: 2h18min
 *               production:
 *                 type: string
 *                 description: Produtora
 *                 example: Warner Bros.
 *               classification:
 *                 type: string
 *                 enum: [C_L, C_10, C_12, C_14, C_16, C_18]
 *                 description: Classificação indicativa
 *                 example: C_14
 *               poster:
 *                 type: string
 *                 format: uri
 *                 nullable: true
 *                 description: URL do cartaz do filme
 *                 example: https://exemplo.com/poster2.jpg
 *     responses:
 *       200:
 *         description: Filme atualizado com sucesso
 *       400:
 *         description: Dados inválidos ou filme não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
movieRoutes.put('/movie', movieController.update);

/**
 * @swagger
 * /api/movie/{id}:
 *   delete:
 *     tags:
 *       - Filmes
 *     summary: Deleta um filme
 *     description: Remove um filme do banco de dados com base no ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do filme
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Filme deletado com sucesso
 *       400:
 *         description: ID inválido ou filme não encontrado
 *       204:
 *         description: Nenhum conteúdo - filme já inexistente
 *       500:
 *         description: Erro interno do servidor
 */
movieRoutes.delete('/movie/:id', movieController.delete);

export default movieRoutes;
