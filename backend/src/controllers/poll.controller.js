import Poll from "../models/Poll.js";
import generatePollCode from "../utils/generatePollCode.js";


// Create a new poll
const createPoll = async (req, res) => {
    try {
        const {
            title,
            description,
            questions,        // FIX: "options" tha pehle, "questions" hona chahiye
            allowAnonymous,   // FIX: "allowAnyonymous" typo fix
            expiresAt
        } = req.body;

        // FIX: questions ab sahi se check ho raha hai
        if (!title || !questions || questions.length === 0) {
            return res.status(400).json({
                message: "Title and questions are required"
            });
        }

        if (!expiresAt) {
            return res.status(400).json({
                message: "Expiry date is required"
            });
        }

        // Validate each question has at least 2 filled options
        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            if (!q.question || q.question.trim() === "") {
                return res.status(400).json({
                    message: `Question ${i + 1} text is required`
                });
            }
            const filledOptions = (q.options || []).filter(o => o.trim() !== "");
            if (filledOptions.length < 2) {
                return res.status(400).json({
                    message: `Question ${i + 1} needs at least 2 options`
                });
            }
            // Convert string options to object format { text }
            q.options = filledOptions.map(o => ({ text: o }));
        }

        const poll = await Poll.create({
            title,
            description,
            creator: req.user._id,
            questions,
            allowAnonymous: allowAnonymous ?? true,
            expiresAt,
            pollCode: generatePollCode(),
        });

        res.status(201).json({
            message: "Poll created successfully",
            poll,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message || "Internal Server Error"
        });
    }
};


// Get Poll by Code (public — for respondents)
const getPollByCode = async (req, res) => {
    try {
        const { code } = req.params;

        const poll = await Poll.findOne({ pollCode: code }).populate("creator", "name email");

        if (!poll) {
            return res.status(404).json({ message: "Poll not found" });
        }

        if (new Date(poll.expiresAt) < new Date()) {
            return res.status(400).json({ message: "Poll has expired" });
        }

        res.status(200).json({ poll });
    } catch (error) {
        res.status(500).json({
            message: error.message || "Internal Server Error"
        });
    }
};


// FIX: Get all polls created by logged-in user (Dashboard ke liye)
const getMyPolls = async (req, res) => {
    try {
        const polls = await Poll.find({ creator: req.user._id }).sort({ createdAt: -1 });

        res.status(200).json({ polls });
    } catch (error) {
        res.status(500).json({
            message: error.message || "Internal Server Error"
        });
    }
};


// FIX: Delete poll by ID
const deletePoll = async (req, res) => {
    try {
        const { id } = req.params;

        const poll = await Poll.findById(id);

        if (!poll) {
            return res.status(404).json({ message: "Poll not found" });
        }

        // Only creator can delete
        if (poll.creator.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Access Denied" });
        }

        await Poll.findByIdAndDelete(id);

        res.status(200).json({ message: "Poll deleted successfully" });
    } catch (error) {
        res.status(500).json({
            message: error.message || "Internal Server Error"
        });
    }
};


export { createPoll, getPollByCode, getMyPolls, deletePoll };