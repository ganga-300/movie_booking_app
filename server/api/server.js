import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "../configs/db.js";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import { inngest, functions } from "../inngest/index.js";
import showRouter from "../routes/showRoutes.js";
import bookingRouter from "../routes/BookingRoutes.js";
import adminRouter from "../routes/adminRoutes.js";
import userRouter from "../routes/userRoutes.js";
import { stripeWebhooks } from "../controllers/stripeWebhooks.js";

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());


app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("DB connection failed:", err);
    res.status(500).json({ error: "Database connection failed" });
  }
});
app.use('/api/stripe/' , express.raw({ type: 'application/json' }), stripeWebhooks);
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use('/api/show', showRouter);
app.use('/api/booking', bookingRouter);
app.use('/api/admin', adminRouter);
app.use('/api/user', userRouter);

// Root route
app.get("/", (req, res) => res.send("Server is Live!"));


const PORT = process.env.PORT || 4000;


if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(` Server running on http://localhost:${PORT}`);
  });
}


export default app;