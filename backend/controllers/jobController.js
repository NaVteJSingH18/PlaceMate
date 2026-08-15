import Job from "../models/Job.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import cloudinary from "../config/cloudinary.js";

export const createJob = asyncHandler(async (req, res) => {
    const job = await Job.create(req.body);

    res.status(201).json(job);
});

export const getAllJobs = asyncHandler(async (req, res) => {
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

    switch (sort) {
        case "newest":
            sortOption = { datePosted: -1 };
            break;

        case "oldest":
            sortOption = { datePosted: 1 };
            break;

        case "salaryHigh":
            sortOption = { "baseSalary.amount": -1 };
            break;

        case "salaryLow":
            sortOption = { "baseSalary.amount": 1 };
            break;

        default:
            sortOption = { datePosted: -1 };
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
});

export const getJobById = asyncHandler(async (req, res) => {
    const job = await Job.findById(req.params.id);

    if (!job) {
    throw new ApiError(404, "Job not found");
}

    res.status(200).json(job);
});

export const updateJob = asyncHandler(async (req, res) => {
    const job = await Job.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true
        }
    );

   if (!job) {
    throw new ApiError(404, "Job not found");
}

    res.status(200).json(job);
});

export const deleteJob = asyncHandler(async (req, res) => {
    const job = await Job.findByIdAndDelete(req.params.id);

    if (!job) {
    throw new ApiError(404, "Job not found");
}

    res.status(200).json({
        message: "Job deleted successfully"
    });
});

export const uploadJobLogo = asyncHandler(async (req, res) => {

    const job = await Job.findById(req.params.id);

    if (!job) {
        throw new ApiError(404, "Job not found");
    }

    if (!req.file) {
        throw new ApiError(400, "Please upload a logo");
    }

    if (job.logo?.public_id) {
        await cloudinary.uploader.destroy(job.logo.public_id);
    }

    job.logo = {
        url: req.file.path,
        public_id: req.file.filename
    };

    await job.save();

    res.status(200).json({
        message: "Logo uploaded successfully",
        logo: job.logo.url
    });

});