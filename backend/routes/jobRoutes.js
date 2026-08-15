import express from 'express'
import { deleteJob, getAllJobs, updateJob,getJobById,createJob,uploadJobLogo } from '../controllers/jobController.js'
import authMiddleware from '../middleware/authMiddleware.js'
import adminMiddleware from '../middleware/adminMiddleware.js'
import { uploadLogoFile } from "../middleware/uploadMiddleware.js";
const router = express.Router()

router.get('/',getAllJobs); 

router.get('/:id',getJobById); 

router.post(
    "/:id/logo",
    authMiddleware,
    adminMiddleware,
    uploadLogoFile.single("logo"),
    uploadJobLogo
);

router.post(
    "/",
    authMiddleware,
    adminMiddleware,
    createJob
);
router.post("/test", createJob);
router.put(
    "/:id",
    authMiddleware,
    adminMiddleware,
    updateJob
);
router.delete(
    "/:id",
    authMiddleware,
    adminMiddleware,
    deleteJob
);
export default router;