import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/auth.routes.js";
import movieRoutes from "./src/routes/movies.routes.js";
import userRoutes from "./src/routes/users.routes.js";
import { notFound, errorHandler } from "./src/middleware/error.js";
import { apiLimiter } from "./src/middleware/rateLimit.js";



dotenv.config();
await connectDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN, credentials: true }));
app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => res.json({ ok: true, service: "movie-review-api" }));

app.use("/api", apiLimiter);
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/users", userRoutes);
 


app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
