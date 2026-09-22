import { createUser, getUsers, findUserByEmail } from "../services/user.services";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { UserInput } from "../types/user.types";
import { config } from "../config/index";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";

export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new AppError("username, email and password are required", 400);
  }

  const user: UserInput = { username, email, password };
  const newUser = await createUser(user);

  if (!newUser) {
    throw new AppError("User already exists", 409);
  }

  res.status(201).json({
    message: "user registered successfully",
    user: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
    },
  });
});

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError("email and password are required", 400);
  }

  const user = await findUserByEmail(email);
  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw new AppError("Invalid credentials", 401);
  }

  const token = jwt.sign({ userId: user.id }, config.jwtSecret, {
    expiresIn: "1h",
  });

  res.json({ token });
});

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await getUsers();
  res.json(users);
});