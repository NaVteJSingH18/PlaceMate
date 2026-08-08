import express from 'express'
import { deleteJob, getAllJobs, updateJob,getJobById,createJob } from '../controllers/jobController.js'
import authMiddleware from '../middleware/authMiddleware.js'
import adminMiddleware from '../middleware/adminMiddleware.js'
const router = express.Router()

router.get('/',getAllJobs); 

router.get('/:id',getJobById); 

router.post(
    "/",
    authMiddleware,
    adminMiddleware,
    createJob
);
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