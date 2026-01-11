import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./utils/errorHandler.js";

const app = express();

app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || ["http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));


//import routes
<<<<<<< HEAD
import userRouter from "../src/routes/user.route.js";
import healthCheckRoute from "../src/routes/healthCheck.route.js";
=======
import userRouter from "./routes/user.route.js";
import healthCheckRoute from "./routes/healthCheck.route.js";
>>>>>>> 6c508029678b2d0e26e8bebf5af2801c8a33bb15

//use routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/health-check", healthCheckRoute);

app.use(errorHandler);

export default app;
