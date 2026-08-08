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