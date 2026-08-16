import express from "express";
import { exportDashboardReport } from "../controllers/reportController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/export", protect, exportDashboardReport);

export default router;
