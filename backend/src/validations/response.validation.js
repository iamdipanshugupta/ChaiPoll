import { body } from "express-validator"

export const submitResponseValidation = [

  body("answers")
    .isArray({ min: 1 })
    .withMessage("Answers are required"),

  body("answers.*.questionId")
    .notEmpty()
    .withMessage("Question ID is required"),

  body("answers.*.selectedOption")
    .trim()
    .notEmpty()
    .withMessage("Selected option is required")
]