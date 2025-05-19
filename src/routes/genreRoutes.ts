import express from "express";
import genreController from "../controller/genreController";
const genreRoutes = express.Router();

/**
 * @swagger
 * tags:
 *   name: Gêneros
 *   description: Endpoints para gerenciar gêneros
 */

/**
 * @swagger
 * /api/genre:
 *   post:
 *     tags:
 *       - Gêneros
 *     summary: Cria um novo gênero
 *     description: Cria um novo gênero com a descrição fornecida
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 description: Descrição do gênero
 *                 example: Ação
 *     responses:
 *       201:
 *         description: Gênero adicionado com sucesso
 *       400:
 *         description: Erro de validação ou dados inválidos
 *       500:
 *         description: Erro interno do servidor
 */
genreRoutes.post("/genre", genreController.create);

/**
 * @swagger
 * /api/genre/{id}:
 *   get:
 *     tags:
 *       - Gêneros
 *     summary: Busca um gênero pelo ID
 *     description: Retorna um gênero específico com base no ID fornecido
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do gênero
 *     responses:
 *       200:
 *         description: Gênero encontrado com sucesso
 *       400:
 *         description: Parâmetro inválido
 *       404:
 *         description: Gênero não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
genreRoutes.get("/genre/:id", genreController.get);

/**
 * @swagger
 * /api/genres:
 *   get:
 *     tags:
 *       - Gêneros
 *     summary: Lista todos os gêneros
 *     description: Retorna uma lista com todos os gêneros cadastrados
 *     responses:
 *       200:
 *         description: Gêneros encontrados com sucesso
 *       204:
 *         description: Nenhum gênero encontrado
 *       500:
 *         description: Erro interno do servidor
 */
genreRoutes.get("/genres", genreController.getAll);

/**
 * @swagger
 * /api/genre:
 *   put:
 *     tags:
 *       - Gêneros
 *     summary: Atualiza um gênero existente
 *     description: Atualiza os dados de um gênero existente com base no ID fornecido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID do gênero
 *                 example: 1
 *               description:
 *                 type: string
 *                 description: Nova descrição do gênero
 *                 example: Aventura
 *     responses:
 *       200:
 *         description: Gênero atualizado com sucesso
 *       400:
 *         description: Gênero não encontrado ou dados inválidos
 *       500:
 *         description: Erro interno do servidor
 */
genreRoutes.put("/genre", genreController.update);

/**
 * @swagger
 * /api/genre/{id}:
 *   delete:
 *     tags:
 *       - Gêneros
 *     summary: Remove um gênero pelo ID
 *     description: Deleta um gênero existente com base no ID fornecido
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do gênero
 *     responses:
 *       200:
 *         description: Gênero deletado com sucesso
 *       400:
 *         description: Parâmetro inválido ou gênero não encontrado
 *       204:
 *         description: Gênero não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
genreRoutes.delete("/genre/:id", genreController.delete);

export default genreRoutes;
