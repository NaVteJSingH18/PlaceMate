import mongoose from 'mongoose';

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
})  

const Student = mongoose.model("Student",studentSchema);

export default Student;