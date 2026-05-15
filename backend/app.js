import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import authroutes from "./src/routes/auth.routes.js";
import pollroutes from "./src/routes/poll.routes.js";
import responsroutes from "./src/routes/response.routes.js";
import analyticsroutes from "./src/routes/analytics.routes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE" ,"PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.get("/", (req, res) => {
    res.send("Api is running");
});

app.use("/api/auth", authroutes);
app.use("/api/polls", pollroutes);
app.use("/api/responses", responsroutes);
app.use("/api/analytics", analyticsroutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || "Server Error"
    });
});

export default app;