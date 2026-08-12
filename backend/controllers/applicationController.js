import Application from "../models/Application.js";
import Student from "../models/Student.js";
import Job from "../models/Job.js";


export const applyForJob = async (req, res) => {
    try {

        const student = await Student.findOne({
            user: req.user.id
        });

        if (!student) {
            return res.status(404).json({
                message: "Student profile not found"
            });
        }

        const job = await Job.findById(req.body.job);

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        const existingApplication = await Application.findOne({
            student: student._id,
            job: req.body.job
        });

        if (existingApplication) {
            return res.status(409).json({
                message: "Already applied to this job"
            });
        }

        const application = await Application.create({
            student: student._id,
            job: req.body.job
        });

        res.status(201).json(application);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


export const getAllApplications = async (req, res) => {
    try {

        const applications = await Application
            .find()
            .populate("student")
            .populate("job");

        res.status(200).json(applications);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


export const updateApplicationStatus = async (req, res) => {
    try {

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

        if (!application)    {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        res.status(200).json(application);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


export const getMyApplications = async (req, res) => {
    try {

        const student = await Student.findOne({
            user: req.user.id
        });

        if (!student) {
            return res.status(404).json({
                message: "Student profile not found"
            });
        }

        const applications = await Application
            .find({ student: student._id })
            .populate("student")
            .populate("job");

        res.status(200).json(applications);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


export const getApplicationById = async (req, res) => {
    try {

        const application = await Application
            .findById(req.params.id)
            .populate("student")
            .populate("job");

        if (!application) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        // Admin can view any application
        if (req.user.role === "admin") {
            return res.status(200).json(application);
        }

        // Find Student belonging to logged-in User
        const student = await Student.findOne({
            user: req.user.id
        });

        if (!student) {
            return res.status(404).json({
                message: "Student profile not found"
            });
        }

        // Check ownership
        if (
            application.student._id.toString() !==
            student._id.toString()
        ) {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        res.status(200).json(application);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};