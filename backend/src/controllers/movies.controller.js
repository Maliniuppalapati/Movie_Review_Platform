import { z } from "zod";
import Movie from "../models/Movie.js";
import Review from "../models/Review.js";

const createMovieSchema = z.object({
  title: z.string().min(1),
  genre: z.string().min(1),
  releaseYear: z.number().int(),
  director: z.string().optional().default(""),
  cast: z.array(z.string()).optional().default([]),
  synopsis: z.string().optional().default(""),
  posterUrl: z.string().url().optional().or(z.literal("")).default("")
});


export async function getMovies(req, res) {
  const page = Math.max(1, parseInt(req.query.page || "1", 10));
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit || "10", 10)));
  const skip = (page - 1) * limit;

  const { search, genre, year, minRating } = req.query;

  const filter = {};

  if (genre) filter.genre = genre;
  if (year) filter.releaseYear = Number(year);
  if (minRating) filter.averageRating = { $gte: Number(minRating) };

  let query = Movie.find(filter);

  if (search) {
    query = Movie.find({
      ...filter,
      $text: { $search: String(search) }
    });
  }

  const total = await Movie.countDocuments(query.getFilter());

  const movies = await query
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

  const movie = await Movie.findById(req.params.id);

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
