import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  passwordHash: {
    type: String,
    required: true
  },

  profilePicture: {
    type: String,
    default: ""
  },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },

  watchlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie"
    }
  ]

}, { timestamps: true });

export default mongoose.model("User", userSchema);