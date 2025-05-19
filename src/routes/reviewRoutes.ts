import express from "express";
import reviewController from "../controller/reviewController";
const reviewRoutes = express.Router();

reviewRoutes.post("/review", reviewController.create);
reviewRoutes.get("/review/:id", reviewController.get);
reviewRoutes.get("/reviews", reviewController.getAll);
reviewRoutes.put("/review", reviewController.update);
reviewRoutes.delete("/review/:id", reviewController.delete);

export default reviewRoutes;
