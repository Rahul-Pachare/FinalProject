import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";

export const authenticateUser = asyncHandler(async (req, res, next) => {
  try {
    // Extract token from headers or cookies
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    //console.log("token",token)
    if (!token) {
      throw new ApiError(401, "Access token is missing.");
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //console.log(decoded)
    // Find user by ID (ensure consistent property name)
    const user = await User.findById(decoded.userId); // Use 'userId' instead of 'userID'
    if (!user) {
      throw new ApiError(401, "User not found.");
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, "Invalid or expired token.");
  }
});