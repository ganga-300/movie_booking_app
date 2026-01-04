import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "../configs/db.js";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import { inngest, functions } from "../inngest/index.js";

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());
app.use("/api/inngest", serve({ client: inngest, functions }));

// Ensure DB is connected for every request
app.use(async (req, res, next) => {
  try {
    await connectDB(); // uses existing connection if already connected
    next();
  } catch (err) {
    console.error("DB connection failed:", err);
    res.status(500).json({ error: "Database connection failed" });
  }
});

// Root route
app.get("/", (req, res) => res.send("Server is Live!"));

// Export app for Vercel serverless
export default app;
