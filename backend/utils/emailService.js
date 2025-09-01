// utils/emailService.js

const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // 1. Create a transporter (the service that will send the email, e.g., Gmail)
    const transporter = nodemailer.createTransport({
        service: 'Gmail', // or another service like Outlook365
        auth: {
            user: process.env.EMAIL_USER, // your email from .env file
            pass: process.env.EMAIL_PASS, // your app password from .env file
        },
    });

    // 2. Define the email options (from, to, subject, content)
    const mailOptions = {
        from: `SportNest Admin <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        html: options.html,
    };

    // 3. Actually send the email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;