import { io } from "socket.io-client";

const socket = io(
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000",
  { autoConnect: true, reconnection: true, reconnectionDelay: 1000 }
);

export default socket;
