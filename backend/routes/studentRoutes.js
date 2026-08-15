import express from 'express';
import {getAllStudents,createStudent,getStudentById,updateStudent,deleteStudent,uploadResume} from '../controllers/studentController.js'
import authMiddleware from '../middleware/authMiddleware.js'
import adminMiddleware from '../middleware/adminMiddleware.js'
import { uploadResumeFile } from "../middleware/uploadMiddleware.js";

const router = express.Router();


router.get('/', getAllStudents);

router.get('/:id', getStudentById);

router.post(
    "/upload-resume",
    authMiddleware,
    uploadResumeFile.single("resume"),
    uploadResume
);

router.post(
    '/',
    authMiddleware,
    adminMiddleware,
    createStudent,
);

router.put(
    '/:id',
    authMiddleware,
    updateStudent
);

router.delete(
    '/:id',
    authMiddleware,
    adminMiddleware,
    deleteStudent
);

export default router;