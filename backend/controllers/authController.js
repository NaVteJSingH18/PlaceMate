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

export const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        throw new ApiError(400, "Invalid current password");
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
});

export const deleteAccount = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (user.role === "student") {
        const Student = (await import("../models/Student.js")).default;
        await Student.findOneAndDelete({ user: user._id });
    }

    await User.findByIdAndDelete(req.user.id);

    res.status(200).json({ message: "Account deleted successfully" });
});

import crypto from "crypto";
import { sendEmail } from "../utils/emailService.js";

export const forgotPassword = asyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    
    if (!user) {
        throw new ApiError(404, "There is no user with that email");
    }

    // Generate token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    
    // Set expire
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    // Create reset url
    const resetUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/reset-password/${resetToken}`;

    const message = `
        <h2>Password Reset Request</h2>
        <p>You requested a password reset. Please make a PUT request to: \n\n ${resetUrl}</p>
        <p>Or click this link to reset your password:</p>
        <a href="${resetUrl}" target="_blank">Reset Password</a>
    `;

    try {
        await sendEmail({
            to: user.email,
            subject: "PlaceMate Password Reset",
            text: `Please reset your password by going to this link: ${resetUrl}`,
            html: message
        });

        res.status(200).json({ success: true, message: "Email sent" });
    } catch (err) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        throw new ApiError(500, "Email could not be sent");
    }
});

export const resetPassword = asyncHandler(async (req, res) => {
    // Get hashed token
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.resetToken).digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        throw new ApiError(400, "Invalid token");
    }

    // Set new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({
        success: true,
        message: "Password updated successfully"
    });
});
