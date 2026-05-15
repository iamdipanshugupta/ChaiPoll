import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    // FIX: "selectedOption" — capital O, frontend se bhi yahi aata hai
    selectedOption: {
        type: String,
        required: true
    }
});

const responseSchema = new mongoose.Schema({
    poll: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Poll",
        required: true
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },

    isAnonymous: {
        type: Boolean,
        default: true
    },

    answers: [answerSchema]

}, { timestamps: true });

const Response = mongoose.model("Response", responseSchema);
export default Response;