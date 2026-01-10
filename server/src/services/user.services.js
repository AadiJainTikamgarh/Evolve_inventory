import { Users } from "../models/user.model.js";
import { userRole } from "../constants/constants.js";
import jwt from "jsonwebtoken";

const MANAGER = ["manager@example.com"];

export const registerUserService = async (userData) => {
  const { name, email, password } = userData;

  const existingUser = await Users.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists with this email.");
  }

  // If manager email then role is manager else User
  const assignedRole = MANAGER.includes(email)
    ? userRole.MANAGER
    : userRole.USER;

  const newUser = await Users.create({
    name,
    email,
    password, // passwrod hashing in model
    role: assignedRole,
  });

  // Return user
  const userResponse = newUser.toObject();
  delete userResponse.password;

  return userResponse;
};


export const loginUserService = async (email, password) => {
  const user = await Users.findOne({ email });
  if (!user) {
    throw new Error("Invalid email or password.");
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new Error("Invalid email or password.");
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || "secret_key",
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );
  return { user, token };
};


export const getAllUsersService = async () => {
  return await Users.find({}).select("-password");
};
