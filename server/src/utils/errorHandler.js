import { ApiError } from "../utils/ApiError.js";

export const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: err.success,
      message: err.message,
      errors: err.errors,
      data: err.data,
    });
  }

  // Handle other errors
  return res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: [],
  });
};
