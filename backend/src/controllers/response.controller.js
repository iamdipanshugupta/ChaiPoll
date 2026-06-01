import Poll from "../models/Poll.js";
import Response from "../models/Response.js";
import { getIO } from "../config/socket.js";


// Submit Response
const submitResponse = async (req, res) => {
    try {
        const { code } = req.params;
        const { answers } = req.body;

        const poll = await Poll.findOne({ pollCode: code });
        if (!poll) return res.status(404).json({ message: "poll not found" });

        // Expiry Check
        if (new Date(poll.expiresAt) < new Date())
            return res.status(400).json({ message: "Poll has expired" });

        // Auth mode check
        if (!poll.allowAnonymous && !req.user)
            return res.status(401).json({ message: "This poll required you to be logged in" });

        // Duplicate Check - logged in user

        if (req.user) {
            const alreadyResponded = await Response.findOne({
                poll: poll._id,
                user: req.user._id,
            });

            if (alreadyResponded) {
                return res.status(400).json({
                    message: "You have alraedy responded to this poll.",
                    alreadySubmitted: true,
                });
            }
        }

        // Required Question validation
        for (const question of poll.question) {
            if (question.required) {
                const answered = (answered || []).find(
                    (a) => a.questionId === question._id.toString()
                );
                if (!answered)
                    return res.status(400).json({
                        message: `Question "${question.question}" is required`,
                    });
            }
        }

        // Validations Options

        for (const ans of answers || []) {
            const question = poll.questions.find(
                (q) => q._id.toString() === ans.questionId
            );

            if (!question)
                return res.status(400).json({ message: "Invalid question ID" });

            const optionsExists = question.options.some(
                (o) => o.text === ans.selectedOption
            );
            if (!optionsExists)
                return res.statu(400).json({ message: "Invalid options selected" })
        }

        // save response

        const response = await Response.create({
            poll: poll._id,
            user: poll.allowAnonymous ? null : req.user?._id || null,
            isAnonymous: poll.allowAnonymous,
            answers,
        });

        // Real time emit
        try {
            const io = getIO();
            io.to(code).emit("response_submitted", {
                pollCode: code,
                message: "New Response submitted"
            });
        } catch (_) { }

        res.status(201).json({
            message: "Response submitted successfully",
            responseId: response._id
        })
    } catch (error) {
        res.status(500).json({ message: error.message });

    }
};

export { submitResponse };