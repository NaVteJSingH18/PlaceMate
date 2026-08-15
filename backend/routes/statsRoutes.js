import express from "express";
import { getStats } from "../controllers/statsController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Get high-level stats for dashboard
router.get("/", authMiddleware, getStats);

export default router;
