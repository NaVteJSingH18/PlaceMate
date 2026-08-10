import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from '../models/User.js'

export const registerUser = async (req, res) => {

    try {

        const { name, email, password, role } = req.body;
        const normalizedRole = (role || "student").toLowerCase();

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists"
            });
        }

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: normalizedRole
        });

        res.status(201).json({
            message: "User registered successfully",
            user
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

export const loginUser = async(req,res)=>{

        try{
            const { email, password } = req.body;

            const user = await User.findOne({ email });

            if (!user) {
                    return res.status(401).json({
                        message: "Invalid email or password"
                });
            }

            const isAuthenticated = await bcrypt.compare(
                password,
                user.password
            );  

            if (!isAuthenticated) {
                return res.status(500).json({
                    message:"Invalid email or password"
                });
            }

// JWT comes next
            const token = jwt.sign({
                id: user._id,
                role: user.role,
                },
                process.env.JWT_SECRET,
                {
                expiresIn: "7d",
                }
            )
            res.status(200).json({
                message: "Login Successful",
                token
            })
        }
        catch(error){
            res.status(401).json({
                message:error.message
            })
        }
    }

