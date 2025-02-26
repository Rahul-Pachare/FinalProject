// backend/src/middlewares/auth.middleware.js
import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { refreshTokenIfNeeded } from "../utils/tokenRefresh.js";

export const authenticateUser = asyncHandler(async (req, res, next) => {
  try {
    // Extract token from headers or cookies
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      throw new ApiError(401, "Access token is missing.");
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by ID
    let user = await User.findById(decoded.userId);
    if (!user) {
      throw new ApiError(401, "User not found.");
    }

    // Refresh Google access token if needed
    user = await refreshTokenIfNeeded(user);

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error.message || "Invalid or expired token.");
  }
});