import dotenv from "dotenv";
dotenv.config();

import http from "http";

import { Server } from "socket.io"

import app from "./app.js";
import connectDB from "./src/config/db.js";

import { initSocket } from "./src/config/socket.js";

connectDB();

const server = http.createServer(app);



initSocket(server)



const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})