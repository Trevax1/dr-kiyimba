const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.'));

// Email transporter configuration
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Verify transporter configuration on startup
transporter.verify(function(error, success) {
    if (error) {
        console.error('SMTP Configuration Error:', error);
    } else {
        console.log('SMTP Server is ready to take our messages');
    }
});

// Form submission endpoint
app.post('/send-email', async (req, res) => {
    const { name, email, service, duration, message } = req.body;

    // Input validation
    if (!name || !email || !service || !duration || !message) {
        return res.status(400).json({ 
            error: 'All fields are required' 
        });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ 
            error: 'Invalid email format' 
        });
    }

    const mailOptions = {
        from: `"Dr. Kiyimba Website" <${process.env.EMAIL_USER}>`,
        to: 'kiyimba50@gmail.com',
        subject: `New Reading Request from ${name}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #9b4dca; margin-bottom: 20px;">New Reading Request</h2>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
                    <p style="margin: 10px 0;"><strong>Email:</strong> ${email}</p>
                    <p style="margin: 10px 0;"><strong>Service:</strong> ${service}</p>
                    <p style="margin: 10px 0;"><strong>Duration:</strong> ${duration}</p>
                </div>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                    <h3 style="color: #9b4dca; margin-bottom: 10px;">Message:</h3>
                    <p style="margin: 0; line-height: 1.6;">${message}</p>
                </div>
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
                    <p>This email was sent from the contact form on Dr. Kiyimba's website.</p>
                </div>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully to:', process.env.EMAIL_USER);
        res.status(200).json({ 
            message: 'Your reading request has been sent successfully. We will contact you shortly.' 
        });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ 
            error: 'Failed to send email. Please try again later or contact us directly.' 
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Something went wrong! Please try again later.' 
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
}); 