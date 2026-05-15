import express from "express";
import {submitResponse} from "../controllers/response.controller.js";
import optionalAuth from "../middleware/optionalAuth.middleware.js";


const router = express.Router();

// Submit response
router.post("/:code",optionalAuth,submitResponse);

export default router;