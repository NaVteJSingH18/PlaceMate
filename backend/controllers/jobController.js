import Job from '../models/Job.js'

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

export const getAllJobs = async (req, res) => {
    try {

        const {
            search,
            category,
            page = 1,
            limit = 10,
            sort = "newest"
        } = req.query;

        const filter = {};

        if (category) {
            filter.category = category;
        }

        if (search) {
            filter.title = {
                $regex: search,
                $options: "i"
            };
        }

        const pageNumber = Number(page);
        const limitNumber = Number(limit);

        const skip = (pageNumber - 1) * limitNumber;

        const totalJobs = await Job.countDocuments(filter);
        let sortOption = {};
            if (sort === "newest"){
                sortOption = { datePosted: -1 };
                }else if (sort === "oldest"){
                sortOption = { datePosted: 1 };
                }
            if (sort === "salaryHigh") {
                sortOption = {
                    "baseSalary.amount": -1
                };
            } else if (sort === "salaryLow") {
                sortOption = {
                    "baseSalary.amount": 1
                };
            }
        const jobs = await Job.find(filter)     
                              .sort(sortOption)
                              .skip(skip)
                              .limit(limitNumber);

        const totalPages = Math.ceil(totalJobs / limitNumber);
        
        res.status(200).json({
            jobs,
            currentPage: pageNumber,
            totalPages,
            totalJobs
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

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