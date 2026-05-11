import { Router } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { getMovies, getMovieById, createMovie, updateMovie, deleteMovie, getAiConsensus } from "../controllers/movies.controller.js";
import { validateObjectId } from "../middleware/validateObjectId.js";
import { getReviewsForMovie, addReview, toggleHelpfulVote } from "../controllers/reviews.controller.js";
import { aiLimiter } from "../middleware/rateLimit.js";

const router = Router();

router.get("/", asyncHandler(getMovies));
router.get("/:id", validateObjectId, asyncHandler(getMovieById));
router.get("/:id/ai-consensus", validateObjectId, aiLimiter, asyncHandler(getAiConsensus));

router.post("/", requireAuth, requireAdmin, asyncHandler(createMovie));
router.put("/:id", validateObjectId, requireAuth, requireAdmin, asyncHandler(updateMovie));
router.delete("/:id", validateObjectId, requireAuth, requireAdmin, asyncHandler(deleteMovie));

router.get("/:id/reviews", validateObjectId, asyncHandler(getReviewsForMovie));
router.post("/:id/reviews", validateObjectId, requireAuth, asyncHandler(addReview));

router.post("/reviews/:reviewId/helpful", validateObjectId, requireAuth, asyncHandler(toggleHelpfulVote));

export default router;
