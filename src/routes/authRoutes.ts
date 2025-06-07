import express from 'express';
import authController from '../controller/authController';
import { checkDuplicateEmail } from '../middlewares';

const authRoutes = express.Router();

authRoutes.post(
    '/auth/register',
    [checkDuplicateEmail],
    authController.register
);
authRoutes.post('/auth/login', authController.login);

export default authRoutes;
