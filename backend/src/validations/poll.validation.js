import { body } from "express-validator"

export const createPollValidation = [

  body("title")
    .trim()
    .notEmpty()
    .withMessage("Poll title is required")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters"),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be text"),

  body("allowAnonymous")
    .isBoolean()
    .withMessage("allowAnonymous must be boolean"),

  body("expiresAt")
    .notEmpty()
    .withMessage("Expiry date is required")
    .isISO8601()
    .withMessage("Invalid expiry date"),

  body("questions")
    .isArray({ min: 1 })
    .withMessage("At least one question is required"),

  body("questions.*.question")
    .trim()
    .notEmpty()
    .withMessage("Question text is required"),

  body("questions.*.required")
    .isBoolean()
    .withMessage("Required field must be boolean"),

  body("questions.*.options")
    .isArray({ min: 2 })
    .withMessage("At least 2 options required"),

  body("questions.*.options.*")
    .trim()
    .notEmpty()
    .withMessage("Option cannot be empty")
]