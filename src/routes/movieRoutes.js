import express from "express";
import { validateRequest } from "../middleware/validateRequest.js";
import { registerMovieSchema, updateMovieSchema } from "../validators/movieValidators.js";
import { addMovie, deleteMovie, updateMovie } from "../controllers/moviesController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router()

router.use(authMiddleware)

router.post("/postmovies", validateRequest(registerMovieSchema), addMovie)

router.put("/:id", validateRequest(updateMovieSchema), updateMovie)

router.delete("/:id", deleteMovie)

export default router;
