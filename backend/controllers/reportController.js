import Application from "../models/Application.js";
import Student from "../models/Student.js";
import Job from "../models/Job.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { parse } from "json2csv";

export const exportDashboardReport = asyncHandler(async (req, res) => {
    // Only admin can export reports
    if (req.user.role !== "admin") {
        throw new ApiError(403, "Access denied. Admin only.");
    }

    const studentsCount = await Student.countDocuments();
    const companiesCount = await Job.distinct("company.name").then(c => c.length);
    const applications = await Application.find().populate("student").populate("job");
    
    const selectedCount = applications.filter(a => a.status === "Selected").length;

    // We can output a combined CSV or just the detailed applications
    // A standard approach for tabular CSV is to just list applications, maybe with some metadata at the top.
    // json2csv is great for array of objects.

    const reportData = applications.map(app => ({
        "Student Name": app.student?.name || "Unknown",
        "Student Email": app.student?.email || "Unknown",
        "Company": app.job?.company?.name || "Unknown",
        "Job Title": app.job?.title || "Unknown",
        "Status": app.status,
        "Date Applied": new Date(app.createdAt).toLocaleDateString()
    }));

    if (reportData.length === 0) {
        reportData.push({
            "Student Name": "No data",
            "Student Email": "No data",
            "Company": "No data",
            "Job Title": "No data",
            "Status": "No data",
            "Date Applied": "No data"
        });
    }

    const csvData = parse(reportData);

    const summarySection = `PLACEMENT SUMMARY REPORT\n\nTotal Students,${studentsCount}\nTotal Companies,${companiesCount}\nTotal Applications,${applications.length}\nTotal Selected,${selectedCount}\n\nDETAILED APPLICATIONS\n\n`;

    const finalCsv = summarySection + csvData;

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=placement_report_${new Date().toISOString().split('T')[0]}.csv`);
    
    res.status(200).send(finalCsv);
});
