import Student from '../models/Student.js'


export const updateStudent = async (req,res)=>{
    try{

        const student = await Student.findByIdAndUpdate(
            req.params.id, // which student?
            req.body,   // data from req that should be update
            {   new:true    }
        );
        if(!student){
            return res.status(404).json("Student not found");
        }

        res.status(200).json(student);
        }catch(error){
            res.status(500).json(
            {message : error.message}
            )
        }
    }

export const getStudentById = async (req,res)=>{
    try{

        const student = await Student.findById(req.params.id);
        
        if(!student){
           return res.status(404).json({message:"Student not found"})
        }
        
        res.status(200).json(student);

        }catch(error){
            res.status(500).json({message:error.message});
    }
}

export const getAllStudents =  async (req,res)=>{
    try{
            const students = await Student.find(); 
            res.status(200).json(students);

        }catch(error){
                res.status(500).json({message:error.message})
    };
   
};


export const createStudent = async (req,res)=>{
    try{

        const student  =  await Student.create(req.body);

        res.status(201).json(student);
        
        }catch(error){
                res.status(500).json({
                    message: error.message
                });
        }
};


export const deleteStudent = async (req, res) => {
    try{
        const student =   await Student.findByIdAndDelete(req.params.id)
        res.status(200).json({
            message: "Student deleted successfully"
        });
        if(!student){
            return  res.status(404).json({
                message: "Student not found"
            })
        }
    }catch(error){
        res.status(500).json({
            message:error.message
        });
    }
}