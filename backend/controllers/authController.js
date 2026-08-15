import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

export const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;
    const normalizedRole = (role || "student").toLowerCase();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new ApiError(409, "User already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: normalizedRole
    });

    if (normalizedRole === "student") {
        // Also import Student at the top of the file if not already imported
        const Student = (await import("../models/Student.js")).default;
        await Student.create({
            name,
            branch: req.body.branch || "Not Specified",
            cgpa: req.body.cgpa ? Number(req.body.cgpa) : 0,
            user: user._id
        });
    }

    res.status(201).json({
        message: "User registered successfully",
        user
    });
});

export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(401, "Invalid email or password");
    }

    const isAuthenticated = await bcrypt.compare(password, user.password);

    if (!isAuthenticated) {
        throw new ApiError(401, "Invalid email or password");
    }

    const token = jwt.sign(
        {
            id: user._id,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );

    let studentId = null;
    if (user.role === "student") {
        const Student = (await import("../models/Student.js")).default;
        const student = await Student.findOne({ user: user._id });
        if (student) studentId = student._id;
    }

    res.status(200).json({
        message: "Login Successful",
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            studentId
        }
    });
});

