import Student from "../models/Student.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import cloudinary from "../config/cloudinary.js";

export const updateStudent = asyncHandler(async (req, res) => {
    const student = await Student.findById(req.params.id);

    if (!student) {
        throw new ApiError(404, "Student profile not found");
    }

    if (student.user.toString() !== req.user.id && req.user.role !== "admin") {
        throw new ApiError(403, "You can only update your own profile");
    }

    const updatedStudent = await Student.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    res.status(200).json(updatedStudent);
});

export const getStudentById = asyncHandler(async (req, res) => {
    const student = await Student.findById(req.params.id);

    if (!student) {
        throw new ApiError(404, "Student profile not found");
    }

    res.status(200).json(student);
});

export const getAllStudents = asyncHandler(async (req, res) => {
    const students = await Student.find();
    res.status(200).json(students);
});

export const createStudent = asyncHandler(async (req, res) => {
    const student = await Student.create(req.body);
    res.status(201).json(student);
});

export const deleteStudent = asyncHandler(async (req, res) => {
    const student = await Student.findById(req.params.id);

    if (!student) {
        throw new ApiError(404, "Student profile not found");
    }
    
    const User = (await import("../models/User.js")).default;
    await User.findByIdAndDelete(student.user);
    await Student.findByIdAndDelete(req.params.id);

    res.status(200).json({
        message: "Student and associated user deleted successfully"
    });
});

export const uploadResume = asyncHandler(async (req, res) => {

    const student = await Student.findOne({
        user: req.user.id
    });

    if (!student) {
        throw new ApiError(404, "Student profile not found");
    }

    if (!req.file) {
        throw new ApiError(400, "Please upload a resume");
    }

    if (student.resume?.public_id) {
        await cloudinary.uploader.destroy(student.resume.public_id, {
            resource_type: "raw"
        });
    }

    student.resume = {

    url: req.file.path,

    public_id: req.file.filename

    };

    await student.save();


    res.status(200).json({
        message: "Resume uploaded successfully",
        resume: student.resume.url
    });

});