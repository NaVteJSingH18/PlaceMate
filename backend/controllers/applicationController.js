import Application from "../models/Application.js";
import Student from "../models/Student.js";
import Job from "../models/Job.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

export const applyForJob = asyncHandler(async (req, res) => {
    const student = await Student.findOne({
        user: req.user.id
    });

    if (!student) {
        throw new ApiError(404, "Student profile not found");
    }

    const job = await Job.findById(req.body.job);

    if (!job) {
        throw new ApiError(404, "Job not found");
    }

    const existingApplication = await Application.findOne({
        student: student._id,
        job: req.body.job
    });

    if (existingApplication) {
        throw new ApiError(409, "Already applied to this job");
    }

    const application = await Application.create({
        student: student._id,
        job: req.body.job
    });

    res.status(201).json(application);
});


export const getAllApplications = asyncHandler(async (req, res) => {
    const applications = await Application
        .find()
        .populate("student")
        .populate("job");

    res.status(200).json(applications);
});


export const updateApplicationStatus = asyncHandler(async (req, res) => {
    const application = await Application.findByIdAndUpdate(
        req.params.id,
        {
            status: req.body.status
        },
        {
            new: true,
            runValidators: true
        }
    );

    if (!application) {
        throw new ApiError(404, "Application not found");
    }

    res.status(200).json(application);
});


export const getMyApplications = asyncHandler(async (req, res) => {
    const student = await Student.findOne({
        user: req.user.id
    });

    if (!student) {
        throw new ApiError(404, "Student profile not found");
    }

    const applications = await Application
        .find({ student: student._id })
        .populate("student")
        .populate("job");

    res.status(200).json(applications);
});


export const getApplicationById = asyncHandler(async (req, res) => {
    const application = await Application
        .findById(req.params.id)
        .populate("student")
        .populate("job");

    if (!application) {
        throw new ApiError(404, "Application not found");
    }

    if (req.user.role === "admin") {
        return res.status(200).json(application);
    }

    const student = await Student.findOne({
        user: req.user.id
    });

    if (!student) {
        throw new ApiError(404, "Student profile not found");
    }

    if (application.student._id.toString() !== student._id.toString()) {
        throw new ApiError(403, "Access denied");
    }

    res.status(200).json(application);
});