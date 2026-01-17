const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // aapka gmail
        pass: process.env.EMAIL_PASS  // app password (not normal gmail password)
    }
});

// Generic function to send email
async function sendEmail(to, subject, html) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        html
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}`);
    } catch (err) {
        console.error("Email send error:", err);
        throw err;
    }
}

module.exports = sendEmail;
