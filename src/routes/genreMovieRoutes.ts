import express from "express";
import genreMovieController from "../controller/genreMovieController";
const genreMovieRoutes = express.Router();

genreMovieRoutes.post("/genreMovie", genreMovieController.create);
genreMovieRoutes.get("/genreMovie/:id", genreMovieController.get);
genreMovieRoutes.get("/genreMovies", genreMovieController.getAll);
genreMovieRoutes.put("/genreMovie", genreMovieController.update);
genreMovieRoutes.delete("/genreMovie/:id", genreMovieController.delete);

export default genreMovieRoutes;
