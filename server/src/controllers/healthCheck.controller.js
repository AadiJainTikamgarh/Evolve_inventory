import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const healthCheckController = asyncHandler(async (req, res) => {
  try {
        // Try to connect and get status
        await connectDB();
        const status = await getDBStatus();
 
        return res.status(200).json({
            status: "🟢 OK",
            database: status,
            timestamp: new Date().toISOString(),
            message: "MongoDB connection is healthy"
        });
    } catch (error) {
        return res.status(500).json({
            status: "🔴 ERROR",
            error: error.message,
            timestamp: new Date().toISOString(),
            message: "Failed to connect to MongoDB"
        });
    }
});

export { healthCheckController };
