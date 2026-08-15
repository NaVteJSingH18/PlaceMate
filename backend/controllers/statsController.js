import asyncHandler from "../utils/asyncHandler.js";
import Student from "../models/Student.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";

export const getStats = asyncHandler(async (req, res) => {
    // Execute MongoDB counts concurrently for maximum efficiency
    const [students, companies, applications, selected] = await Promise.all([
        Student.countDocuments(),
        Job.countDocuments(),
        Application.countDocuments(),
        Application.countDocuments({ status: "Selected" })
    ]);

    res.status(200).json({
        students,
        companies, // The number of jobs/drives posted
        applications,
        selected
    });
});
