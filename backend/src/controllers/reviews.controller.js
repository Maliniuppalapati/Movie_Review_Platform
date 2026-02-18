import { z } from "zod";
import Movie from "../models/Movie.js";
import Review from "../models/Review.js";


const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  reviewText: z.string().max(2000).optional().default("")
});



async function recomputeAverage(movieId) {

  const stats = await Review.aggregate([
    {
      $match: { movieId }
    },
    {
      $group: {
        _id: "$movieId",
        avg: { $avg: "$rating" }
      }
    }
  ]);

  const avg = stats.length
    ? Number(stats[0].avg.toFixed(2))
    : 0;

  await Movie.findByIdAndUpdate(movieId, {
    averageRating: avg
  });

  return avg;
}




export async function getReviewsForMovie(req, res) {

  const movieId = req.params.id;

  const reviews = await Review.find({ movieId })
    .populate("userId", "username profilePicture")
    .sort({ createdAt: -1 });

  res.json({
    reviews
  });
}




export async function addReview(req, res) {

  const movieId = req.params.id;

  const movie = await Movie.findById(movieId);

  if (!movie) {
    res.status(404);
    throw new Error("Movie not found");
  }

  const data = reviewSchema.parse(req.body);


  let review;

  try {

    review = await Review.create({
      userId: req.user._id,
      movieId: movie._id,
      rating: data.rating,
      reviewText: data.reviewText
    });

  } catch (e) {

    res.status(409);
    throw new Error("You already reviewed this movie");

  }


  const averageRating = await recomputeAverage(movie._id);


  const populatedReview = await Review.findById(review._id)
    .populate("userId", "username profilePicture");


  res.status(201).json({
    review: populatedReview,
    averageRating
  });
}
