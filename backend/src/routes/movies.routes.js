import { Router } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { getMovies, getMovieById, createMovie } from "../controllers/movies.controller.js";
import { getReviewsForMovie, addReview } from "../controllers/reviews.controller.js";

const router = Router();

router.get("/", asyncHandler(getMovies));
router.get("/:id", asyncHandler(getMovieById));

router.post("/", requireAuth, requireAdmin, asyncHandler(createMovie));

router.get("/:id/reviews", asyncHandler(getReviewsForMovie));
router.post("/:id/reviews", requireAuth, asyncHandler(addReview));

export default router;
