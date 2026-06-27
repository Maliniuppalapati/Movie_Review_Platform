import { z } from "zod";
import mongoose from "mongoose";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Movie from "../models/Movie.js";
import Review from "../models/Review.js";

const createMovieSchema = z.object({
  title: z.string().min(1),
  genre: z.string().min(1),
  releaseYear: z.number().int(),
  director: z.string().optional(),
  cast: z.array(z.string()).optional(),
  synopsis: z.string().optional(),
  posterUrl: z.string().url().optional().or(z.literal(""))
});

const updateMovieSchema = createMovieSchema.partial();

export async function getMovies(req, res) {
  const page = Math.max(1, parseInt(req.query.page || "1", 10));
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit || "10", 10)));
  const skip = (page - 1) * limit;

  const { search, genre, year, minRating } = req.query;

  const filter = {};

  if (genre) filter.genre = genre;
  if (year) filter.releaseYear = Number(year);
  if (minRating) filter.averageRating = { $gte: Number(minRating) };

  if (search) {
    filter.$text = { $search: String(search) };
  }

  const total = await Movie.countDocuments(filter);

  const movies = await Movie.find(filter)
    .sort({ averageRating: -1, createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.json({
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    movies
  });
}

export async function getMovieById(req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid movie ID" });
  }

  const movie = await Movie.findById(id);

  if (!movie) {
    res.status(404);
    throw new Error("Movie not found");
  }

  const reviews = await Review.find({ movieId: movie._id })
    .populate("userId", "username profilePicture")
    .sort({ createdAt: -1 });

  res.json({
    movie,
    reviews
  });
}

export async function createMovie(req, res) {
  const data = createMovieSchema.parse(req.body);

  const movie = await Movie.create(data);

  res.status(201).json({
    movie
  });
}

export async function updateMovie(req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid movie ID" });
  }

  const data = updateMovieSchema.parse(req.body);

  const movie = await Movie.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true
  });

  if (!movie) {
    res.status(404);
    throw new Error("Movie not found");
  }

  res.json({ movie });
}

export async function deleteMovie(req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid movie ID" });
  }

  const movie = await Movie.findByIdAndDelete(id);

  if (!movie) {
    res.status(404);
    throw new Error("Movie not found");
  }

  await Review.deleteMany({ movieId: movie._id });

  res.json({ message: "Movie deleted successfully" });
}

export async function getAiConsensus(req, res) {
  const movie = await Movie.findById(req.params.id);
  if (!movie) {
    res.status(404);
    throw new Error("Movie not found");
  }

  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  if (movie.aiSummary?.text && movie.aiSummary.updatedAt > oneDayAgo) {
    return res.json({ consensus: movie.aiSummary.text });
  }

  const reviews = await Review.find({ movieId: movie._id, reviewText: { $ne: "" } }).sort({ createdAt: -1 }).limit(50);
  if (reviews.length === 0) return res.json({ consensus: "Not enough reviews to generate a consensus." });

  if (!process.env.GEMINI_API_KEY) return res.json({ consensus: "AI integration requires GEMINI_API_KEY in backend environment." });

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
     const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const reviewTexts = reviews.map(r => r.reviewText).join("\n---\n");
    const prompt = `Summarize the following movie reviews in 1 sentence. Focus on overall sentiment, positives, and negatives. Avoid spoilers.\n\nReviews:\n${reviewTexts}`;

    const result = await model.generateContent(prompt);
    const consensusText = result.response.text().trim();

    movie.aiSummary = { text: consensusText, updatedAt: new Date() };
    await movie.save();

    res.json({ consensus: consensusText });
  } catch (err) {
    console.error("AI Error:", err);
    res.status(500);
    throw new Error("AI summary unavailable. Try again later.");
  }
}
