import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
// import cron from 'node-cron';
 import authRoutes from './routes/auth.route.js';
import mailRoutes from './routes/mail.route.js';
import userRoutes from './routes/user.route.js'; 
// import trashRoutes from './routes/trash.route.js'; // Import trash routes

//import { processNewEmails } from './controllers/mail.controller.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));
app.use(express.json({ limit: '20kb' }));
app.use(express.urlencoded({ extended: true, limit: '20kb' }));

// Routes
app.use('/auth', authRoutes);
app.use('/api/mails', mailRoutes);
 app.use('/api/users',userRoutes)
// app.use('/api/trash', trashRoutes); // Add trash routes


app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy and running!',
  });
});


export default app;