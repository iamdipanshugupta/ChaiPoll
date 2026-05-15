import dotenv from "dotenv";
dotenv.config();

import http from "http";

import {Server} from "socket.io"

import app from "./app.js";
import connectDB from "./src/config/db.js";

import {initSocket} from "./src/config/socket.js";

connectDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST"],
  },
});

initSocket(io)

io.on("connection" ,(socket)=>{
    console.log("User Connected", socket.id)

    socket.on("join_poll",(pollCode)=>{
        socket.join(pollCode)
        console.log(`Joined room: ${pollCode}`)
    })
    socket.on("disconnect" , ()=>{
        console.log("User Disconnected", socket.id)
    })
})

const PORT = process.env.PORT || 5000;

server.listen(PORT , ()=>{
    console.log(`Server is running on port ${PORT}`)
})