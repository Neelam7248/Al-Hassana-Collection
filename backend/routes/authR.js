const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require('dotenv').config();
const User = require('../models/User');
const auth = require('../middleware/auth');
const sendEmail = require('./utils/mailer'); // sendEmail(to, subject, html)
const passport = require('passport');

const JWT_SECRET = process.env.JWT_SECRET;

// -------------------- GOOGLE LOGIN --------------------
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const token = jwt.sign(
      { userId: req.user._id, email: req.user.email, userType: req.user.userType },
      JWT_SECRET,
      { expiresIn: '2h' }
    );
    res.redirect(`http://localhost:3000?token=${token}`);
  }
);

// -------------------- SIGNUP WITH EMAIL VERIFICATION --------------------
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, phone, address, userType } = req.body;

    if (!name || !email || !password || !phone || !address || !userType) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(403).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      userType,
      isVerified: false,
      verificationToken
    });
    await newUser.save();

    // Send verification email
 const verifyLink = `http://localhost:5000/api/auth/verify-email?token=${verificationToken}`;

    await sendEmail(email, "Verify your email", `
      <p>Hi ${name},</p>
      <p>Thank you for registering. Please verify your email by clicking the link below:</p>
      <a href="${verifyLink}">Verify Email</a>
      <p>This link will expire in 24 hours.</p>
    `);

    res.status(200).json({ message: "Verification email sent. Please check your inbox." });

  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// -------------------- EMAIL VERIFICATION LINK --------------------
router.get('/verify-email', async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).send("Invalid verification link");
    }

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).send("Invalid or expired verification link");
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    // ✅ frontend signin page par bhej do
    res.redirect("http://localhost:3000/signin?verified=true");

  } catch (err) {
    console.error("Email verification error:", err);
    res.status(500).send("Server error");
  }
});

// -------------------- SIGNIN --------------------
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Missing required fields" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Wrong email id" });

    if (!user.isVerified) return res.status(403).json({ message: "Please verify your email first" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign(
      { userId: user._id, email: user.email, name: user.name, userType: user.userType },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.status(200).json({
      message: "Signin successful",
      token,
      user: {
        userId: user._id,
        email: user.email,
        name: user.name,
        
        userType: user.userType
      }
    });
  } catch (err) {
    console.error("Signin failed:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// -------------------- PROFILE --------------------
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    console.error("Profile error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// -------------------- ADMIN USER MANAGEMENT --------------------
router.get('/users', auth, async (req, res) => {
  try {
    if (req.user.userType !== 'admin') return res.status(403).json({ message: "Access denied" });
    const users = await User.find({ userType: 'customer' }).select("-password");
    res.status(200).json({ users });
  } catch (err) {
    console.error("Admin fetch users error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.get("/users/search", auth, async (req, res) => {
  try {
    const query = req.query.query;
    const customers = await User.find({
      userType: 'customer',
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } }
      ]
    });
    res.status(200).json({ message: "Search success", customers });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: "Search failed", error: err.message });
  }
});

// -------------------- SOFT DELETE / RESTORE --------------------
router.put("/users/:id/soft-delete", auth, async (req, res) => {
  try {
    if (req.user.userType !== "admin") return res.status(403).json({ message: "Access denied" });

    const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "Customer soft-deleted successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

router.put("/users/:id/restore", auth, async (req, res) => {
  try {
    if (req.user.userType !== "admin") return res.status(403).json({ message: "Access denied" });

    const user = await User.findByIdAndUpdate(req.params.id, { isActive: true }, { new: true }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User restored successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// -------------------- PROFILE UPDATE --------------------
router.put("/UPprofile", auth, async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    await user.save();
    res.json({
      message: "Profile updated successfully",
      user: { name: user.name, email: user.email, phone: user.phone, address: user.address, userType: user.userType }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------- FORGOT PASSWORD / OTP --------------------
const pendingOTP = {};

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Email not registered" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit
    pendingOTP[email] = { otp, otpExpires: Date.now() + 5 * 60 * 1000 };

    await sendEmail(email, "Password Reset OTP", `Your OTP is: ${otp}`);
    res.status(200).json({ message: "OTP sent to your email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send OTP", error: err.message });
  }
});

router.post('/verify-forgot-otp', async (req, res) => {
  const { email, otp } = req.body;
  const data = pendingOTP[email];
  if (!data) return res.status(400).json({ message: "No OTP request found" });
  if (data.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
  if (Date.now() > data.otpExpires) return res.status(400).json({ message: "OTP expired" });

  res.status(200).json({ message: "OTP verified successfully" });
});

router.post('/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const data = pendingOTP[email];
  if (!data) return res.status(400).json({ message: "No OTP request found" });
  if (data.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
  if (Date.now() > data.otpExpires) return res.status(400).json({ message: "OTP expired" });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  delete pendingOTP[email];

  res.status(200).json({ message: "Password reset successfully" });
});

module.exports = router;
