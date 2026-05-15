import Poll from "../models/Poll.js";
import Response from "../models/Response.js";
import { getIO } from "../config/socket.js";


// Submit Response
const submitResponse = async (req, res) => {
    try {
        const { code } = req.params;
        const { answers } = req.body;

        // Find poll
        const poll = await Poll.findOne({ pollCode: code });

        if (!poll) {
            return res.status(404).json({ message: "Poll not found" });
        }

        // Expiry check
        if (new Date(poll.expiresAt) < new Date()) {
            return res.status(400).json({ message: "Poll has expired" });
        }

        // FIX: allowAnonymous (pehle allowAnyonymous typo tha model mein bhi)
        // Authenticated poll mein user login hona chahiye
        if (!poll.allowAnonymous && !req.user) {
            return res.status(401).json({
                message: "This poll requires you to be logged in"
            });
        }

        // Required question validation
        for (const question of poll.questions) {
            if (question.required) {
                const answered = answers.find(
                    ans => ans.questionId === question._id.toString()
                );
                if (!answered) {
                    return res.status(400).json({
                        message: `Question "${question.question}" is required`
                    });
                }
            }
        }

        // Validate that selected options actually exist in the question
        for (const ans of answers) {
            const question = poll.questions.find(
                q => q._id.toString() === ans.questionId
            );
            if (!question) {
                return res.status(400).json({ message: "Invalid question ID" });
            }
            const optionExists = question.options.some(
                opt => opt.text === ans.selectedOption
            );
            if (!optionExists) {
                return res.status(400).json({ message: "Invalid option selected" });
            }
        }

        // Save response
        // FIX: allowAnonymous spelling consistent rakha
        const response = await Response.create({
            poll: poll._id,
            user: poll.allowAnonymous ? null : (req.user?._id || null),
            isAnonymous: poll.allowAnonymous,
            answers  // selectedOption ab model se match karta hai
        });

        // Socket emit — real-time update
        const io = getIO();
        io.to(code).emit("response_submitted", {
            pollCode: code,
            message: "New response submitted"
        });

        res.status(201).json({
            message: "Response submitted successfully",
            responseId: response._id
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export { submitResponse };