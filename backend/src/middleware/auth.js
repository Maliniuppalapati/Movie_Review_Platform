import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    res.status(401);
    return next(new Error("Unauthorized"));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-passwordHash");
    if (!user) {
      res.status(401);
      return next(new Error("Unauthorized"));
    }
    req.user = user;
    next();
  } catch {
    res.status(401);
    next(new Error("Unauthorized"));
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user?.isAdmin) {
    res.status(403);
    return next(new Error("Admin only"));
  }
  next();
}
