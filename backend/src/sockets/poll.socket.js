import { getIO } from "../config/socket.js";

// Emit new response event to all users in a poll room
const emitNewResponse = (pollCode, data = {}) => {
  try {
    const io = getIO();
    io.to(pollCode).emit("response_submitted", {
      pollCode,
      message: "New response received",
      ...data,
    });
  } catch (error) {
    console.error("Socket emit error:", error.message);
  }
};

// Emit poll published event
const emitPollPublished = (pollCode) => {
  try {
    const io = getIO();
    io.to(pollCode).emit("poll_published", {
      pollCode,
      message: "Poll results have been published",
    });
  } catch (error) {
    console.error("Socket emit error:", error.message);
  }
};

// Emit poll expired event
const emitPollExpired = (pollCode) => {
  try {
    const io = getIO();
    io.to(pollCode).emit("poll_expired", {
      pollCode,
      message: "This poll has expired",
    });
  } catch (error) {
    console.error("Socket emit error:", error.message);
  }
};

export { emitNewResponse, emitPollPublished, emitPollExpired };
