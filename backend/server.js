import express from 'express';
import authRoutes from './routes/authRoutes.js'
import studentRoutes from './routes/studentRoutes.js'
import jobRoutes from './routes/jobRoutes.js'
import connectDB from './config/db.js'
import dotenv from 'dotenv' 
dotenv.config();

connectDB();
 
const app=express(); 

app.use(express.json());


const PORT = Number(process.env.PORT) || 5000

app.use('/auth', authRoutes);
app.use('/students',studentRoutes);

app.use('/jobs',jobRoutes);
 
app.get("/", (req, res) => {
    res.send("Welcome to PlaceMate Backend 🚀");
});                                                             

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})