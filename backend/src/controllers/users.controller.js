import { z } from "zod";
import User from "../models/User.js";
import Review from "../models/Review.js";
import Movie from "../models/Movie.js";

const updateSchema = z.object({
  username: z.string().min(3).optional(),
  profilePicture: z.string().url().optional().or(z.literal(""))
});

function ensureSelf(req, userId) {
  if (req.user._id.toString() !== userId && !req.user.isAdmin) {
    const err = new Error("Forbidden");
    err.status = 403;
    throw err;
  }
}

export async function getUser(req, res) {
  const userId = req.params.id;
  ensureSelf(req, userId);

  const user = await User.findById(userId).select("-passwordHash").populate("watchlist");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const reviews = await Review.find({ userId: user._id })
    .populate("movieId", "title posterUrl genre releaseYear averageRating")
    .sort({ createdAt: -1 });

  res.json({ user, reviews });
}

export async function updateUser(req, res) {
  const userId = req.params.id;
  ensureSelf(req, userId);

  const data = updateSchema.parse(req.body);
  const user = await User.findByIdAndUpdate(
    userId,
    { $set: data },
    { new: true }
  ).select("-passwordHash");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json({ user });
}

export async function getWatchlist(req, res) {
  const userId = req.params.id;
  ensureSelf(req, userId);

  const user = await User.findById(userId).populate("watchlist");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json({ watchlist: user.watchlist });
}

export async function addToWatchlist(req, res) {
  const userId = req.params.id;
  ensureSelf(req, userId);

  const bodySchema = z.object({ movieId: z.string().min(1) });
  const { movieId } = bodySchema.parse(req.body);

  const movie = await Movie.findById(movieId);
  if (!movie) {
    res.status(404);
    throw new Error("Movie not found");
  }

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const exists = user.watchlist.some((m) => m.toString() === movieId);
  if (!exists) user.watchlist.push(movie._id);

  await user.save();
  const populated = await User.findById(userId).populate("watchlist");
  res.json({ watchlist: populated.watchlist });
}

export async function removeFromWatchlist(req, res) {
  const userId = req.params.id;
  ensureSelf(req, userId);

  const movieId = req.params.movieId;

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.watchlist = user.watchlist.filter((m) => m.toString() !== movieId);
  await user.save();

  const populated = await User.findById(userId).populate("watchlist");
  res.json({ watchlist: populated.watchlist });
}
