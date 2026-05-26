import express from "express";
import {submitResponse} from "../controllers/response.controller.js";
import optionalAuth from "../middleware/optionalAuth.middleware.js";
import {submitResponseValidation} from "../validations/response.validation.js"
import validate from "../middleware/validate.middleware.js";
const router = express.Router();

// Submit response
router.post("/:code",optionalAuth,submitResponseValidation,validate,submitResponse);

export default router;