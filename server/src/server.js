import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { initializeDemoAccounts, startDemoCleanupJob } from "./utils/demoSetup.js";

dotenv.config();
await connectDB();

// Initialize demo accounts and cleanup job
await initializeDemoAccounts();
startDemoCleanupJob();

const PORT = process.env.PORT || 8000;

if (process.env.NODE_ENV === "development") {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
export default app;
