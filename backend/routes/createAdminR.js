const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const User = require("../models/User");
const auth = require("../middleware/auth");
const sendEmail = require("./utils/mailer");

// 🔐 ADMIN creates users
router.post("/create-user", auth, async (req, res) => {
  try {
    // ✅ Only admin allowed
    if (req.user.userType !== "admin") {
      return res.status(403).json({ message: "Only admin can create users" });
    }

    const { name, email, password, phone, address, department, userType } = req.body;

    // ✅ Validation
    if (!name || !email || !password || !phone || !address || !userType) {
      return res.status(400).json({ message: "All fields required" });
    }

    // ✅ Allow only specific roles
    if (!["admin", "deliveryBoy"].includes(userType)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      department,
      userType, // ✅ controlled
      isVerified: false,
      verificationToken,
      verificationTokenExpiry: Date.now() + 24 * 60 * 60 * 1000
    });

    await newUser.save();

    // 📧 Email
    sendEmail(
      email,
      "Verify your account",
      `<p>Click to verify:</p>
       <a href="http://localhost:5000/api/create-admin/verify-email?token=${verificationToken}">
       Verify Email</a>`
    );

    res.status(201).json({
      message: `${userType} created successfully. Verification email sent`
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
router.get('/verify-email', async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).send("Invalid verification link");
    }

    const user = await User.findOne({ verificationToken: token });

if (!user || user.verificationTokenExpiry < Date.now()) {
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
// ✅ GET ALL DELIVERY BOYS
router.get("/delivery-boys", auth, async (req, res) => {
  try {
    if (req.user.userType !== "admin") {
      return res.status(403).json({ message: "Only admin allowed" });
    }

    const deliveryBoys = await User.find({ userType: "deliveryBoy" })
      .select("name email _id");

    res.json(deliveryBoys);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
// get all orders for delivery boy

router.get("/my-orders", auth, async (req, res) => {
  try {
    if (req.user.userType !== "deliveryBoy") {
      return res.status(403).json({ message: "Access denied" });
    }

    const orders = await Order.find({
      deliveryBoy: req.user.id
    }).populate("deliveryBoy", "name email phone").sort({ createdAt: -1 });

    res.json(orders);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;