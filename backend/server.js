import dotenv from "dotenv";
dotenv.config();

import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import connectDB from "./src/config/db.js";
import { initSocket } from "./src/config/socket.js";

connectDB();

const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:5173",
  "https://chai-poll-nine.vercel.app",
  process.env.CLIENT_URL,
].filter(Boolean);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST"],
  },
});

initSocket(io);

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  socket.on("join_poll", (pollCode) => {
    socket.join(pollCode);
    console.log(`Socket ${socket.id} joined room: ${pollCode}`);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
