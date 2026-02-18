import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import User from "../models/User.js";

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password required")
});

function generateToken(userId) {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export async function register(req, res) {
  const data = registerSchema.parse(req.body);

  const existing = await User.findOne({ email: data.email });

  if (existing) {
    res.status(400);
    throw new Error("Account already exists. Please login.");
  }

  const passwordHash = await bcrypt.hash(data.password, 10);

  const user = await User.create({
    username: data.username,
    email: data.email,
    passwordHash
  });

  res.status(201).json({
    token: generateToken(user._id),
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture || ""
    }
  });
}

export async function login(req, res) {
  const data = loginSchema.parse(req.body);

  const user = await User.findOne({ email: data.email });

  if (!user) {
    res.status(400);
    throw new Error("Invalid email");
  }

  if (!user.passwordHash) {
    res.status(500);
    throw new Error("User password missing. Re-register user.");
  }

  const ok = await bcrypt.compare(data.password, user.passwordHash);

  if (!ok) {
    res.status(400);
    throw new Error("Invalid password");
  }

  res.json({
    token: generateToken(user._id),
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture || ""
    }
  });
}