import { AppDataSource } from "./config/data-source";
import dotenv from "dotenv";
import authRoutes from './routes/auth';
import { errorHandler } from "./middlewares/error-handler.middleware";

dotenv.config();

import express = require("express");

const app = express();

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: "API is running",
    endpoints: {
      register: "POST /auth/register",
      verifyOtp: "POST /auth/verify-otp",
      resendOtp: "POST /auth/resend-otp",
      login: "POST /auth/login",
    },
  });
});

// Health endpoint
app.get('/health', (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

// Auth routes
app.use('/auth', authRoutes);

// 404 handler - Catch all undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handling middleware
app.use(errorHandler);

// Server port
const PORT = process.env.PORT || 3000;

// Initialize database and start server
AppDataSource.initialize()
  .then(() => {
    console.log("Database connected successfully!");
    console.log("Available Endpoints:");
    console.log("  GET  /");
    console.log("  GET  /health");
    console.log("  POST /auth/register");
    console.log("  POST /auth/verify-otp");
    console.log("  POST /auth/resend-otp");
    console.log("  POST /auth/login");
    console.log(" Server is listening on port", PORT);

    app.listen(PORT, () => {
      console.log(" Server started successfully!");
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: Error) => {
  console.error("Unhandled Rejection:", err);
  process.exit(1);
});












