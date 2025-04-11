import express from "express";
import userController from "../controller/userController";
const userRoutes = express.Router();

userRoutes.post("/user", userController.createUser);
userRoutes.get("/user/:id", userController.getUser);
userRoutes.get("/users", userController.getAllUsers);
userRoutes.put("/user", userController.updateUser);
userRoutes.delete("/user/:id", userController.deleteUser);

export default userRoutes;
