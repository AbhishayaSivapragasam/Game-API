import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { UserRouter } from './routes/user.js';  // Import the user routes

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5173'],  // Adjust the port to match your frontend
    credentials: true, // Allow cookies to be sent
}));
app.use(cookieParser());

// Routes
app.use('/auth', UserRouter);  // Register UserRouter to handle routes prefixed with /auth

// MongoDB Connection
try {
    mongoose.connect('mongodb://127.0.0.1:27017/authentication', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
} catch (error) {
    console.error("Database connection error:", error.message);
    process.exit(1);
}

// Server Start
app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
});
