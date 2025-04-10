import express from "express";
import userController from "../controller/userController";
const userRoutes = express.Router();

userRoutes.post("/user/create", userController.createUser);

export default userRoutes;
