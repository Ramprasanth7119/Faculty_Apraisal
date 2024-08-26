const nodemailer = require('nodemailer');
require('dotenv').config();

const sendVerificationEmail = async (email, token) => {
    const transporter = nodemailer.createTransport({
        host: process.env.HOST,
        service: process.env.SERVICE,
        port: process.env.EMAIL_PORT,
        secure: process.env.SECURE === 'true', // Convert from string to boolean
        auth: {
            user: process.env.USER,
            pass: process.env.PASS
        }
    });

    // Construct the verification URL using BASE_URL
    const verificationUrl = `${process.env.BASE_URL}/verify-email?token=${token}`;

    const mailOptions = {
        from: process.env.USER,
        to: email,
        subject: 'Email Verification',
        html: `
            <h1>Email Verification</h1>
            <p>Thank you for registering. Please verify your email by clicking the link below:</p>
            <a href="${verificationUrl}">Verify Email</a>
            <p>If you did not register, please ignore this email.</p>
        `
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendVerificationEmail;
