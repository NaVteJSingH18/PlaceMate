import express from 'express';
import {getAllStudents,createStudent,getStudentById,updateStudent,deleteStudent} from '../controllers/studentController.js'
import authMiddleware from '../middleware/authMiddleware.js'
import adminMiddleware from '../middleware/adminMiddleware.js'
const router = express.Router();


router.get('/', getAllStudents);

router.get('/:id', getStudentById);

router.post(
    '/',
    authMiddleware,
    adminMiddleware,
    createStudent
);

router.put(
    '/:id',
    authMiddleware,
    adminMiddleware,
    updateStudent
);

router.delete(
    '/:id',
    authMiddleware,
    adminMiddleware,
    deleteStudent
);

export default router;