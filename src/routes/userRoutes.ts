import express, { RequestHandler } from "express";
import userController from "../controller/userController";
const userRoutes = express.Router();

// Wrapper para converter os métodos do controlador para o tipo RequestHandler que o Express espera
const adaptRoute = (handler: Function): RequestHandler => {
  return (req, res, next) => {
    return Promise.resolve(handler(req, res, next))
      .catch(next);
  };
};

/**
 * @swagger
 * /api/user:
 *   post:
 *     summary: Criar um novo usuário
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - nickname
 *               - birthDate
 *               - userType
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               nickname:
 *                 type: string
 *               birthDate:
 *                 type: string
 *                 format: date
 *               userType:
 *                 type: string
 *                 enum: [A, C]
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro interno do servidor
 */
userRoutes.post("/user", adaptRoute(userController.createUser));

/**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     summary: Obter usuário pelo ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
userRoutes.get("/user/:id", adaptRoute(userController.getUser));

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Listar todos os usuários
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuários
 *       500:
 *         description: Erro interno do servidor
 */
userRoutes.get("/users", adaptRoute(userController.getAllUsers));

/**
 * @swagger
 * /api/user:
 *   put:
 *     summary: Atualizar usuário
 *     tags: [Users]
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
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               nickname:
 *                 type: string
 *               birthDate:
 *                 type: string
 *                 format: date
 *               userType:
 *                 type: string
 *                 enum: [A, C]
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
userRoutes.put("/user", adaptRoute(userController.updateUser));

/**
 * @swagger
 * /api/user/{id}:
 *   delete:
 *     summary: Excluir usuário
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário excluído com sucesso
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
userRoutes.delete("/user/:id", adaptRoute(userController.deleteUser));

export default userRoutes;
