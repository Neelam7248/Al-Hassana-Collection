const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Admin/User model
const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const sendOTP = require("./utils/mailer");  // aapka mailer.js
const generateOTP = require("./utils/otp"); // aapka otp.js

// POST /api/create-admin
router.post("/", auth, async (req, res) => {
  try {
    const { name, email, password, phone, userType } = req.body;

    // 1️⃣ Validate input
    if (!name || !email || !password || !phone || !userType) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2️⃣ Check if admin already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Admin with this email already exists" });
    }

    // 3️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Generate OTP
    const otp = generateOTP(6);
    const otpExpires = Date.now() + 5 * 60 * 1000; // OTP valid for 5 minutes

    // 5️⃣ Create new admin (store OTP)
    const newAdmin = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      userType: "admin",
      otp,
      otpExpires
    });

    // 6️⃣ Send OTP via email
    await sendOTP(email, otp);

    res.status(201).json({
      message: "New admin created successfully. OTP sent to email.",
      adminId: newAdmin._id
    });

  } catch (err) {
    console.error("Error creating admin:", err);
    res.status(500).json({ message: "Server error", err });
  }
});


// -------------------------------
// VERIFY OTP ROUTE
// -------------------------------
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const admin = await User.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    if (admin.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

    if (admin.otpExpires < Date.now()) return res.status(400).json({ message: "OTP expired" });

    // OTP verified → clear it from database
    admin.otp = null;
    admin.otpExpires = null;
    await admin.save();

    res.json({ message: "OTP verified successfully!" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", err });
  }
});

module.exports = router;
