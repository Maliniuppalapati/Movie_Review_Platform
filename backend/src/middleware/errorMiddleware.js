export function errorHandler(err, req, res, next) {
  const status =
    res.statusCode && res.statusCode !== 200
      ? res.statusCode
      : 500;

  if (err?.name === "ZodError") {
    return res.status(400).json({
      message: err.errors?.[0]?.message || "Invalid input",
    });
  }

  res.status(status).json({
    message: err.message || "Server error",
  });
}
