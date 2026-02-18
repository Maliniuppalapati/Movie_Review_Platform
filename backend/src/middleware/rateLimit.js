import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200
});

export const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30
});
