import express from 'express';
import userController from '../controller/userController';
import { checkDuplicateEmail, isAdmin, verifyToken } from '../middlewares';
const userRoutes = express.Router();

/**
 * @swagger
 * tags:
 *   name: Usuários
 *   description: Endpoints para gerenciar usuários
 */

/**
 * @swagger
 * /api/user:
 *   post:
 *     tags:
 *       - Usuários
 *     summary: Cria um novo usuário
 *     description: Cria um novo usuário com os dados fornecidos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: João Silva
 *               email:
 *                 type: string
 *                 example: joao@email.com
 *               password:
 *                 type: string
 *                 example: senha123
 *               active:
 *                 type: boolean
 *                 example: true
 *               nickname:
 *                 type: string
 *                 example: joaosilva
 *               birthDate:
 *                 type: string
 *                 format: date
 *                 example: 2000-01-01
 *               userType:
 *                 type: string
 *                 enum: [A, C]
 *                 example: C
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Erro de validação ou criação
 *       500:
 *         description: Erro interno do servidor
 */
userRoutes.post(
    '/user',
    [verifyToken, isAdmin, checkDuplicateEmail],
    userController.create
);

/**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     tags:
 *       - Usuários
 *     summary: Busca um usuário pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário encontrado com sucesso
 *       400:
 *         description: Parâmetro inválido
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
userRoutes.get('/user/:id', [verifyToken], userController.get);

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags:
 *       - Usuários
 *     summary: Lista todos os usuários
 *     responses:
 *       200:
 *         description: Lista de usuários
 *       204:
 *         description: Nenhum usuário encontrado
 *       500:
 *         description: Erro interno do servidor
 */

userRoutes.get('/users', [verifyToken, isAdmin], userController.getAll);

/**
 * @swagger
 * /api/user:
 *   put:
 *     tags:
 *       - Usuários
 *     summary: Atualiza os dados de um usuário existente
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
 *                 example: 1
 *               name:
 *                 type: string
 *                 example: João Atualizado
 *               email:
 *                 type: string
 *                 example: joao@atualizado.com
 *               password:
 *                 type: string
 *                 example: novaSenha123
 *               active:
 *                 type: boolean
 *                 example: true
 *               nickname:
 *                 type: string
 *                 example: joaoa
 *               birthDate:
 *                 type: string
 *                 format: date
 *                 example: 2000-01-01
 *               userType:
 *                 type: string
 *                 enum: [A, C]
 *                 example: A
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *       400:
 *         description: Parâmetro inválido ou usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
userRoutes.put(
    '/user',
    [verifyToken, isAdmin, checkDuplicateEmail],
    userController.update
);

/**
 * @swagger
 * /api/user/{id}:
 *   delete:
 *     tags:
 *       - Usuários
 *     summary: Remove um usuário pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário deletado com sucesso
 *       400:
 *         description: Parâmetro inválido ou usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
userRoutes.delete('/user/:id', [verifyToken, isAdmin], userController.delete);

export default userRoutes;
