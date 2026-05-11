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
import { validateObjectId } from "../middleware/validateObjectId.js";

const router = Router();

router.get("/:id", validateObjectId, requireAuth, asyncHandler(getUser));
router.put("/:id", validateObjectId, requireAuth, asyncHandler(updateUser));

router.get("/:id/watchlist", validateObjectId, requireAuth, asyncHandler(getWatchlist));
router.post("/:id/watchlist", validateObjectId, requireAuth, asyncHandler(addToWatchlist));
router.delete("/:id/watchlist/:movieId", validateObjectId, requireAuth, asyncHandler(removeFromWatchlist));

export default router;
