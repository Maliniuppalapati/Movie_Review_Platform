import rateLimit from "express-rate-limit";

export const apiLimiter = (req, res, next) => {
  if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
    return strictLimiter(req, res, next);
  }
  return relaxedLimiter(req, res, next);
};

export const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // 100 per 15 min for strict
  message: "Too many requests, please try again later."
});

export const relaxedLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000 // 1000 per 15 min for browsing
});

export const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: "Too many AI requests, please try again later."
});

export const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30
});
