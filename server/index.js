const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
const sendVerificationEmail = require('./sendEmail');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",
    methods: ['GET', 'POST'],
    credentials: true
}));
app.use(cookieParser());

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'faclogin'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Database connected successfully');
    }
});

// Function to handle user registration
app.post('/register', async (req, res) => {
    const { name, email, password, aadhar } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = uuidv4();

    const sql = 'INSERT INTO faclogin.register (name, email, password, aadhar_id, verification_token, is_verified) VALUES (?, ?, ?, ?, ?, ?)';

    db.query(sql, [name, email, hashedPassword, aadhar, verificationToken, false], async (err, result) => {
        if (err) {
            console.error('Database query error:', err);
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ Status: 'error', Message: 'Email or Aadhar number already exists' });
            } else {
                return res.status(500).json({ Status: 'error', Message: 'Registration failed' });
            }
        } else {
            try {
                await sendVerificationEmail(email, verificationToken);
                return res.json({ Status: 'success', Message: 'User registered successfully, please check your email for verification' });
            } catch (emailErr) {
                console.error('Failed to send verification email:', emailErr);
                return res.status(500).json({ Status: 'error', Message: 'Registration successful but failed to send verification email' });
            }
        }
    });
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM faclogin.register WHERE email = ?';
    db.query(sql, [email], async (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ Status: 'error', Message: 'Login failed' });
        }
        if (results.length === 0) {
            return res.status(401).json({ Status: 'error', Message: 'Invalid email or password' });
        }
        const user = results[0];
        if (!user.is_verified) {
            return res.status(401).json({ Status: 'error', Message: 'Email not verified' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ Status: 'error', Message: 'Invalid email or password' });
        }
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Set to true if you're using HTTPS
            sameSite: 'lax' // Adjust based on your needs
        });
        return res.json({ Status: 'success', Message: 'Login successful', isVerified: user.is_verified });
    });
});

app.get('/verify-email', (req, res) => {
    const { token } = req.query;

    const sql = 'UPDATE faclogin.register SET is_verified = TRUE, verification_token = NULL WHERE verification_token = ?';

    db.query(sql, [token], (err, result) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ Status: 'error', Message: 'Email verification failed' });
        }

        if (result.affectedRows > 0) {
            return res.json({ Status: 'success', Message: 'Email verified successfully. You can now login.' });
        } else {
            return res.status(400).json({ Status: 'error', Message: 'Invalid or expired token' });
        }
    });
});

app.post('/resend-verification-email', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ Status: 'error', Message: 'Email is required' });
    }

    const sql = 'SELECT * FROM faclogin.register WHERE email = ?';
    db.query(sql, [email], async (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ Status: 'error', Message: 'An error occurred' });
        }

        if (results.length === 0) {
            return res.status(404).json({ Status: 'error', Message: 'User not found' });
        }

        const user = results[0];
        if (user.is_verified) {
            return res.status(400).json({ Status: 'error', Message: 'Email already verified' });
        }

        try {
            const verificationToken = user.verification_token;
            await sendVerificationEmail(email, verificationToken);
            return res.json({ Status: 'success', Message: 'Verification email resent successfully' });
        } catch (emailErr) {
            console.error('Failed to send verification email:', emailErr);
            return res.status(500).json({ Status: 'error', Message: 'Failed to resend verification email' });
        }
    });
});

app.get('/logout', (req, res) => {
    res.cookie('token', '', { expires: new Date(0), httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.json({ Status: 'success', Message: 'Logged out successfully' });
});

app.get('/', (req, res) => {
    const token = req.cookies.token; 

    if (!token) {
        return res.json({ msg: 'Not authenticated' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.json({ msg: 'Not authenticated' });
        }
        res.json({ msg: 'success', name: decoded.email });
    });
});

app.listen(3001, () => {
    console.log('App is listening on port 3001');
});
