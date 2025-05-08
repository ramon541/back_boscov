import express from "express";
import userController from "../controller/userController";
const userRoutes = express.Router();

userRoutes.post("/user", userController.create);
userRoutes.get("/user/:id", userController.get);
userRoutes.get("/users", userController.getAll);
userRoutes.put("/user", userController.update);
userRoutes.delete("/user/:id", userController.delete);

export default userRoutes;
