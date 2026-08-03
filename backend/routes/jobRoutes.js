import express from 'express'
import { deleteJob, getAllJobs, updateJob,getJobById,createJob } from '../controllers/jobController.js'
const router = express.Router()

router.get('/',getAllJobs); 

router.get('/:id',getJobById); 

router.post('/',createJob);     

router.put('/:id',updateJob);        

router.delete('/:id',deleteJob); 

export default router;