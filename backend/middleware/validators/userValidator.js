import { body, validationResult } from "express-validator";

export const validateRegister = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 2 })
        .withMessage("Name must be at least 2 characters"),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email format")
        .normalizeEmail(),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),

    body("role")
        .notEmpty()
        .withMessage("Role is required")
        .isIn(["student", "admin"])
        .withMessage("Role must be either student or admin"),

    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        next();
    }
];

export const validateLogin = [
    body("email")
        .isEmail()
        .withMessage("Invalid email"),

    body("password")
        .notEmpty()
        .withMessage("Password is required"),

    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        next();
    }
];