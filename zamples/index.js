const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",
    methods: ['GET', 'POST'],
    credentials: true
}));
app.use(cookieParser());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'faclogin' // Ensure this matches your database name
});

db.connect((err) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Database connected successfully');
    }
});

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json({ msg: 'We need token...' });
    } else {
        jwt.verify(token, 'our-jsonwebtoken-secret-key', (err, decoded) => {
            if (err) {
                console.log(err);
                return res.json({ msg: 'Authentication error' });
            } else {
                req.name = decoded.name;
                next();
            }
        });
    }
};

app.get('/', verifyUser, (req, res) => {
    return res.json({ msg: 'success', name: req.name });
});

app.get('/logout', (req, res) => {
    res.clearCookie('token'); // Clear the cookie by name
    return res.json({ Status: 'success' });
});

app.post('/login', (req, res) => {
    // Ensure 'faclogin.falogin' is the correct table name
    const sql = 'SELECT * FROM faclogin.falogin WHERE email = ? AND password = ?';

    db.query(sql, [req.body.email, req.body.password], (err, data) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ msg: "Server side error" });
        }
        if (data.length > 0) {
            const name = data[0].name;
            const token = jwt.sign({ name }, 'our-jsonwebtoken-secret-key', { expiresIn: '1d' });
            res.cookie('token', token, { httpOnly: true }); // Set httpOnly flag for security
            return res.json({ Status: 'success' });
        } else {
            return res.status(404).json({ Message: 'No records matching' });
        }
    });
});

app.listen(3001, () => {
    console.log('App is listening on port 3001');
});
