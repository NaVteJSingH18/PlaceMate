import Job from '../models/job.js'

export const createJob = async (req,res)=>{
    try{
        const job = await Job.create(req.body);
        res.status(201).json(job);

    }
    catch(error){
        res.status(500).json({
            message:error.message
        })
    }
}

export const getAllJobs = async (req,res)=>{
    try{
        const jobs = await Job.find();
        res.status(200).json(jobs);

    }catch(error){
        res.status(500).json({
            message:error.message
        })
    }
}

export const getJobById = async (req,res)=>{
    try{
        const job = await Job.findById(
            req.params.id,
        )
        if(!job){
           return res.status(404).json({
                message:"Job not Found"
            })
        }
        res.status(200).json(job);

    }
    catch(error){
        res.status(500).json({
            message:error.message
        })
    }
}

export const updateJob = async (req,res)=>{
    try{
        const job = await Job.findByIdAndUpdate(
            req.params.id,
            req.body, {   new:true    });
        if(!job){
           return res.status(404).json({
                message:"Job not Found"
            })
        }
        res.status(200).json(job);
    }
    catch(error){
        res.status(500).json({
            message:error.message
        })
    }
}

export const deleteJob = async (req,res)=>{
    try{
        const job = await Job.deleteById(req.params.id);
        if(!job){
            res.status(404).json({
                message:"Job not Found"
            })
        }
        res.status(200).json({
        message:"Job is deleted"
    });
    }catch(error){
        res.status(500).json({
                message:error.message
            })
    }
}