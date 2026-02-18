import { Router } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { requireAuth } from "../middleware/auth.js";
import {
  getUser,
  updateUser,
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist
} from "../controllers/users.controller.js";

const router = Router();

router.get("/:id", requireAuth, asyncHandler(getUser));
router.put("/:id", requireAuth, asyncHandler(updateUser));

router.get("/:id/watchlist", requireAuth, asyncHandler(getWatchlist));
router.post("/:id/watchlist", requireAuth, asyncHandler(addToWatchlist));
router.delete("/:id/watchlist/:movieId", requireAuth, asyncHandler(removeFromWatchlist));

export default router;
