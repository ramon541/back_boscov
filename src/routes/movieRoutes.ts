import express from "express";
import movieController from "../controller/movieController";
const movieRoutes = express.Router();

movieRoutes.post("/movie", movieController.create);
movieRoutes.get("/movie/:id", movieController.get);
movieRoutes.get("/movies", movieController.getAll);
movieRoutes.put("/movie", movieController.update);
movieRoutes.delete("/movie/:id", movieController.delete);

export default movieRoutes;
