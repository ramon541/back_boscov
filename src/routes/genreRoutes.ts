import express from "express";
import genreController from "../controller/genreController";
const genreRoutes = express.Router();

genreRoutes.post("/genre", genreController.create);
genreRoutes.get("/genre/:id", genreController.get);
genreRoutes.get("/genres", genreController.getAll);
genreRoutes.put("/genre", genreController.update);
genreRoutes.delete("/genre/:id", genreController.delete);

export default genreRoutes;
