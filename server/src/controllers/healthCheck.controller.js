import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const healthCheckController = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, "OK", "OK"));
});

export { healthCheckController };
