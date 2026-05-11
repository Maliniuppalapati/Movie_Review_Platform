import { ZodError } from "zod";

export function notFound(req, res, next) {
  res.status(404);
  next(new Error(`Not found: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(err, req, res, next) {
  const status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
    });
  }

  res.status(status).json({
    message: err.message || "Server error"
  });
}
