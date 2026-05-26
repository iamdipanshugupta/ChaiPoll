import { Server } from "socket.io";

let io;

const initSocket = (server) => {

  io = new Server(server, {

    cors: {
      origin: [
        "http://localhost:5173",
        "https://chai-poll-nine.vercel.app",
      ],
      credentials: true,
      methods: ["GET", "POST"]
    }

  });

  io.on("connection", (socket) => {

    console.log("User connected:", socket.id);

    socket.on("join_poll", (pollCode) => {

      socket.join(pollCode);

      console.log(`Socket joined poll room: ${pollCode}`);

    });

    socket.on("leave_poll", (pollCode) => {

      socket.leave(pollCode);

      console.log(`Socket left poll room: ${pollCode}`);

    });

    socket.on("disconnect", () => {

      console.log("User disconnected:", socket.id);

    });

  });

  return io;
};

const getIO = () => {

  if (!io) {
    throw new Error("Socket.io not initialized");
  }

  return io;
};

export { initSocket, getIO };