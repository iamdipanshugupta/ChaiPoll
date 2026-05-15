import mongoose from "mongoose";

const optionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true,
    }
});

// FIX: "required" field ab sahi jagah hai — options ke andar nahi, question level pe
const questionsSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
        trim: true,
    },
    required: {
        type: Boolean,
        default: false,
    },
    options: {
        type: [optionSchema],
        validate: {
            validator: function (value) {
                return value.length >= 2;
            },
            message: "At least 2 options required"
        },
    }
});

const pollSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    questions: [questionsSchema],

    // FIX: consistent spelling — "allowAnonymous" (pehle "allowAnyonymous" typo tha)
    allowAnonymous: {
        type: Boolean,
        default: true,
    },

    expiresAt: {
        type: Date,
        required: true,
    },

    ispublished: {
        type: Boolean,
        default: false,
    },

    pollCode: {
        type: String,
        unique: true,
        required: true
    },

}, { timestamps: true });

const Poll = mongoose.model("Poll", pollSchema);
export default Poll;