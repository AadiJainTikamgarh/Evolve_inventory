import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  getAllLogsService,
  getUserLogsService,
} from "../services/logs.services.js";

// Managers → all logs
export const getAllLogsController = asyncHandler(async (req, res) => {
  const logs = await getAllLogsService();
  return res.status(200).json(new ApiResponse(200, logs, "All logs fetched"));
});

// Users → their logs
export const getUserLogsController = asyncHandler(async (req, res) => {
  const logs = await getUserLogsService(req.user._id);
  return res.status(200).json(new ApiResponse(200, logs, "User logs fetched"));
});
