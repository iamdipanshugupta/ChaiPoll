import Poll from "../models/Poll.js";
import Response from "../models/Response.js";


// Get Poll Analytics (creator only — private)
const getPollAnalytics = async (req, res) => {
    try {
        const { pollId } = req.params;

        const poll = await Poll.findById(pollId);

        if (!poll) {
            return res.status(404).json({ message: "Poll not found" });
        }

        // Only creator can view analytics
        if (poll.creator.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Access Denied" });
        }

        const responses = await Response.find({ poll: pollId });

        const analytics = {
            totalResponses: responses.length,
            pollTitle: poll.title,           // FIX: frontend ko pollTitle chahiye tha
            ispublished: poll.ispublished,
            pollCode: poll.pollCode,
            questions: []
        };

        for (const question of poll.questions) {
            const optionCounts = {};

            for (const option of question.options) {
                optionCounts[option.text] = 0;
            }

            let answeredCount = 0;

            for (const response of responses) {
                const answer = response.answers.find(
                    ans => ans.questionId.toString() === question._id.toString()
                );
                if (answer) {
                    // FIX: selectedOption — capital O (model se match)
                    if (optionCounts[answer.selectedOption] !== undefined) {
                        optionCounts[answer.selectedOption]++;
                        answeredCount++;
                    }
                }
            }

            analytics.questions.push({
                questionId: question._id,
                question: question.question,
                required: question.required,
                answered: answeredCount,
                skipped: responses.length - answeredCount,
                optionCounts
            });
        }

        // FIX: response structure seedha { analytics } ke andar — frontend se match
        res.status(200).json({ analytics });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Publish Poll Results
const publishresults = async (req, res) => {
    try {
        const { pollId } = req.params;

        const poll = await Poll.findById(pollId);

        if (!poll) {
            return res.status(404).json({ message: "Poll not found" });
        }

        if (poll.creator.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Access Denied" });
        }

        poll.ispublished = true;
        await poll.save();

        res.status(200).json({ message: "Poll results published successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get Public Results (anyone can access after publish)
const getPublicResults = async (req, res) => {
    try {
        const { code } = req.params;

        const poll = await Poll.findOne({ pollCode: code });

        if (!poll) {
            return res.status(404).json({ message: "Poll not found" });
        }

        if (!poll.ispublished) {
            return res.status(403).json({ message: "Results not published yet" });
        }

        const responses = await Response.find({ poll: poll._id });

        // FIX: response structure mein title aur totalResponses directly results ke andar
        const results = {
            title: poll.title,
            totalResponses: responses.length,
            questions: []
        };

        for (const question of poll.questions) {
            const optionCounts = {};

            for (const option of question.options) {
                optionCounts[option.text] = 0;
            }

            for (const response of responses) {
                const answer = response.answers.find(
                    ans => ans.questionId.toString() === question._id.toString()
                );
                // FIX: selectedOption — capital O
                if (answer && optionCounts[answer.selectedOption] !== undefined) {
                    optionCounts[answer.selectedOption]++;
                }
            }

            results.questions.push({
                question: question.question,
                optionCounts
            });
        }

        res.status(200).json({ results });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export { getPollAnalytics, publishresults, getPublicResults };