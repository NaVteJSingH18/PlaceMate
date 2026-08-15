import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const resumeStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "placemate/resumes",
        resource_type: "raw"
    }
});

const logoStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "placemate/logos",
        resource_type: "image",
        allowed_formats: ["jpg", "jpeg", "png", "webp", "svg"]
    }
});

export const uploadResumeFile = multer({
    storage: resumeStorage
});

export const uploadLogoFile = multer({
    storage: logoStorage
});