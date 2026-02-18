import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    genre: { type: String, required: true, trim: true },
    releaseYear: { type: Number, required: true },
    director: { type: String, default: "" },
    cast: [{ type: String }],
    synopsis: { type: String, default: "" },
    posterUrl: { type: String, default: "" },
    averageRating: { type: Number, default: 0 }
  },
  { timestamps: true }
);

movieSchema.index({ title: "text" });

export default mongoose.model("Movie", movieSchema);
