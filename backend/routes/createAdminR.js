const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Admin/User model
const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const sendOTP = require("./utils/mailer");  // aapka mailer.js
const generateOTP = require("./utils/otp"); // aapka otp.js

// -------------------------------
// HELPER: Generate Employee Code
// -------------------------------
async function generateEmployeeCode(userType, department) {
  if (userType === "admin") {
    // Count existing admins in the department
    const count = await User.countDocuments({ userType: "admin", department });
    const codeNumber = String(count + 1).padStart(3, "0");
    return `${department}-${codeNumber}`; // e.g., IT-001
  } else if (userType === "customer") {
    const count = await User.countDocuments({ userType: "customer" });
    const codeNumber = String(count + 1).padStart(3, "0");
    return `CUS-${codeNumber}`; // e.g., CUS-001
  }
}

// -------------------------------
// CREATE ADMIN / CUSTOMER ROUTE
// -------------------------------
router.post("/", auth, async (req, res) => {
  try {
    const { name, email, password, phone, userType, department } = req.body;

    // 1️⃣ Validate input
    if (!name || !email || !password || !phone || !userType) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (userType === "admin" && !department) {
      return res.status(400).json({ message: "Department is required for admin" });
    }

    // 2️⃣ Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: `${userType} with this email already exists` });
    }

    // 3️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Generate OTP
    const otp = generateOTP(6);
    const otpExpires = Date.now() + 5 * 60 * 1000; // OTP valid for 5 minutes

    // 5️⃣ Generate employee/customer code
    const employeeCode = await generateEmployeeCode(userType, department);

    // 6️⃣ Create new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      userType,
      department: userType === "admin" ? department : null,
      employeeCode,
      otp,
      otpExpires,
    });

    // 7️⃣ Send OTP via email
    await sendOTP(email, otp);

    res.status(201).json({
      message: `${userType} created successfully. OTP sent to email.`,
      userId: newUser._id,
      employeeCode,
    });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ message: "Server error", err });
  }
});

// -------------------------------
// VERIFY OTP ROUTE
// -------------------------------
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

    if (user.otpExpires < Date.now()) return res.status(400).json({ message: "OTP expired" });

    // OTP verified → clear it from database
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.json({ message: "OTP verified successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", err });
  }
});

module.exports = router;
