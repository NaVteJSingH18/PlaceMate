import express from "express";

import {
    applyForJob,
    getAllApplications,
    updateApplicationStatus,
    getMyApplications,
    getApplicationById
} from "../controllers/applicationController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();


// Student applies for a job
router.post(
    "/",
    authMiddleware,
    applyForJob
);


// Student sees their own applications
router.get(
    "/my",
    authMiddleware,
    getMyApplications
);

router.get(
    "/:id",
    authMiddleware,
    getApplicationById
);

// Admin sees all applications
router.get(
    "/",
    authMiddleware,
    adminMiddleware,
    getAllApplications
);


// Admin updates application status
router.put(
    "/:id/status",
    authMiddleware,
    adminMiddleware,
    updateApplicationStatus
);

export default router;