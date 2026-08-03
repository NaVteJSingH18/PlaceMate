import express from 'express';
import {getAllStudents,createStudent,getStudentById,updateStudent,deleteStudent} from '../controllers/studentController.js'

const router = express.Router();



router.get('/',getAllStudents); //get all students

router.get('/:id',getStudentById);  // get one students

router.post('/',createStudent);     // create a student

router.put('/:id',updateStudent);         // update a student

router.delete('/:id',deleteStudent); // delete a student

export default router;