import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    branch: {
        type: String,
        required: true,
    },

    cgpa: {
        type: Number,
        required: true,
    },

    skills: [
        {
            type: String,
        },
    ],

    resume: {
        url: {
        type: String
        },
        public_id: {
        type: String
        }
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});

const Student = mongoose.model("Student", studentSchema);

export default Student;