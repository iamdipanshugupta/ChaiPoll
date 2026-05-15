import express from "express";
import protect from "../middleware/auth.middleware.js";
import { createPoll, getPollByCode, getMyPolls, deletePoll } from "../controllers/poll.controller.js";

const router = express.Router();

// FIX: /my-polls route add kiya — Dashboard ke liye zaroori tha
// NOTE: yeh "/:code" se PEHLE hona chahiye, warna Express "my-polls" ko code samjh leta
router.get("/my-polls", protect, getMyPolls);

router.post("/", protect, createPoll);

// FIX: delete route add kiya
router.delete("/:id", protect, deletePoll);

router.get("/:code", getPollByCode);

export default router;