import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const router = express.Router();

// Middleware to verify JWT token
const verifyUser = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ status: false, message: 'No token provided' });
        }
        const decoded = jwt.verify(token, process.env.KEY);
        req.user = decoded; // Store decoded user info for later use
        next();
    } catch (err) {
        return res.status(401).json({ status: false, message: 'Invalid token', error: err.message });
    }
};

// Signup Route
router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ status: false, message: 'User already exists' });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashPassword });

        await newUser.save();
        return res.status(201).json({ status: true, message: 'User registered successfully' });
    } catch (err) {
        return res.status(500).json({ status: false, message: 'Registration failed', error: err.message });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: false, message: 'User not registered' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ status: false, message: 'Incorrect password' });
        }

        const token = jwt.sign({ username: user.username, email: user.email }, process.env.KEY, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // 1 hour
        return res.status(200).json({ status: true, message: 'Login successful' });
    } catch (err) {
        return res.status(500).json({ status: false, message: 'Login failed', error: err.message });
    }
});

// Logout Route
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.status(200).json({ status: true, message: 'Logged out successfully' });
});

// Profile Route - Fetch User Details
router.get('/profile', verifyUser, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email });
        if (!user) {
            return res.status(404).json({ status: false, message: 'User not found' });
        }
        res.status(200).json({ username: user.username, email: user.email, points: user.points });
    } catch (err) {
        res.status(500).json({ status: false, message: 'Failed to fetch user profile', error: err.message });
    }
});
router.post('/save-points', verifyUser, async (req, res) => {
    const { points } = req.body;

    try {
        const user = await User.findOne({ email: req.user.email });
        if (!user) {
            return res.status(404).json({ status: false, message: 'User not found' });
        }

        user.points += points; // Add points to the user's existing points
        await user.save();

        res.status(200).json({ status: true, message: 'Points updated successfully', points: user.points });
    } catch (err) {
        res.status(500).json({ status: false, message: 'Failed to save points', error: err.message });
    }
});


// Leaderboard Route - Get Users Sorted by Score
router.get('/leaderboard', async (req, res) => {
    try {
        const users = await User.find().sort({ points: -1 }); // Sort by points in descending order
        const leaderboard = users.map((user, index) => ({
            rank: index + 1,
            username: user.username,
            points: user.points
        }));
        res.status(200).json(leaderboard);
    } catch (err) {
        res.status(500).json({ status: false, message: 'Failed to fetch leaderboard', error: err.message });
    }
});




export { router as UserRouter };
