import 'dotenv/config';
import express from 'express';
import authRoutes from './routes/authRoutes.js'
import studentRoutes from './routes/studentRoutes.js'
import jobRoutes from './routes/jobRoutes.js'
import applicationRoutes from './routes/applicationRoutes.js'
import statsRoutes from './routes/statsRoutes.js'
import reportRoutes from './routes/reportRoutes.js'
import connectDB from './config/db.js'
import errorMiddleware from './middleware/errorMiddleware.js'
import cors from 'cors';

connectDB();
 
const app=express(); 

// Enable CORS for all domains, or specify your frontend URL
app.use(cors({
    origin: '*', // You can restrict this to your frontend URL later, e.g. ['https://placemate.vercel.app']
    credentials: true
}));

app.use(express.json());


const PORT = Number(process.env.PORT) || 5000

app.use('/api/auth', authRoutes);
app.use('/api/students',studentRoutes);

app.use('/api/jobs',jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/reports', reportRoutes);
 
app.get("/", (req, res) => {
    res.send("Welcome to PlaceMate Backend 🚀");
});                                                             
app.use(errorMiddleware);
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})