import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import researchRouter from "./routes/research.js";

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS with default settings (allow all origins for now)
app.use(cors());

// Body parser middleware to handle JSON payloads
app.use(express.json());

// Routes
app.use("/api/research", researchRouter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack || err.message || err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal Server Error",
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
