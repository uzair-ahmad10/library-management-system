import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./errorMiddlewares.js";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  // 1. Get the token from the cookies
  const { token } = req.cookies;

  // 2. If there is no token, the user is not logged in
  if (!token) {
    return next(new ErrorHandler("User is not authenticated", 400));
  }

  // 3. Verify the token using the secret key
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // 4. Find the user in the database using the ID from the decoded token
  req.user = await User.findById(decoded.id);

  // Ensure user still exists in database
  if (!req.user) {
    return next(new ErrorHandler("User not found with this token", 404));
  }

  // 5. Move to the next middleware or route handler
  next();
});


export const isAuthorized = (...roles) => {

  return (req, res, next) => {

    // Fix: Normalize both roles to lowercase and trim whitespace to prevent mismatch
    const userRole = req.user?.role ? req.user.role.trim().toLowerCase() : "";
    const allowedRoles = roles.map((r) => r.trim().toLowerCase());

    // Check if the user's role exists in the allowed roles array
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `User with this role (${req.user.role}) is not allowed to access this resource`,
          403 // forbidden
        )
      );
    }
    // If they have the correct role, move to the next function
    next();
  };
};