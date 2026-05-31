import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import passport from "passport";
import initPassPort from "./src/config/passport.js";


import authroutes from "./src/routes/auth.routes.js";
import pollroutes from "./src/routes/poll.routes.js";
import responsroutes from "./src/routes/response.routes.js";
import analyticsroutes from "./src/routes/analytics.routes.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://chai-poll-sigma.vercel.app",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

initPassPort();
app.use(passport.initialize());

// Health check
app.get("/", (req, res) => {
  res.json({ message: "☕ ChaiPoll API is running", status: "ok" });
});

// Routes
app.use("/api/auth", authroutes);
app.use("/api/polls", pollroutes);
app.use("/api/responses", responsroutes);
app.use("/api/analytics", analyticsroutes);

// 404
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler — 4 params zaroori hain
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

export default app;
