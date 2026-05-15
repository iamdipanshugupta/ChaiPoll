import express from "express";

import protect from "../middleware/auth.middleware.js";

import {getPollAnalytics, publishresults , getPublicResults} from "../controllers/analytics.controller.js";

const router = express.Router()


// public results
router.get("/public/:code" , getPublicResults)


// privatre analytics
router.get("/:pollId" , protect , getPollAnalytics)

// publish results
router.patch("/:pollId/publish" , protect , publishresults)



export default router;