import { Router } from "express";
import { conductResearch, streamResearch } from "../controllers/researchController.js";

const router = Router();

/**
 * @route   POST /api/research
 * @desc    Execute the full research graph synchronously
 * @access  Public
 */
router.post("/", conductResearch);

/**
 * @route   GET /api/research/stream
 * @desc    Stream research graph progress via Server-Sent Events (SSE)
 * @access  Public
 */
router.get("/stream", streamResearch);

export default router;
