import express from "express";
import genreController from "../controller/genreController";
const genreRoutes = express.Router();

genreRoutes.post("/genre", genreController.createGenre);
genreRoutes.get("/genre/:id", genreController.getGenre);
genreRoutes.get("/genres", genreController.getAllGenres);
genreRoutes.put("/genre", genreController.updateGenre);
genreRoutes.delete("/genre/:id", genreController.deleteGenre);

export default genreRoutes;
