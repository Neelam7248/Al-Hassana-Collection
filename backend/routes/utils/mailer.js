const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function sendOTP(email, otp) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP for Signup',
        text: `Your OTP is: ${otp}. It will expire in 5 minutes.`
    };

    return transporter.sendMail(mailOptions);
}

module.exports = sendOTP;
