const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/User');
const auth = require('../middleware/auth');
const JWT_SECRET = process.env.JWT_SECRET;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
const passport = require('passport'); // add this line at top
const generateOTP = require('./utils/otp');
const sendOTP = require('./utils/mailer');

// Start Google login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google callback
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        // Successful login, generate JWT
        const token = jwt.sign(
            { userId: req.user._id, email: req.user.email, userType: req.user.userType },
            JWT_SECRET,
            { expiresIn: '2h' }
        );

        // Redirect front-end with token
        res.redirect(`http://localhost:3000?token=${token}`);
    }
);

router.post('/signup', async (req, res) => {
 console.log("Signup request received:", req.body); // S
    try {
        const { name, email, userType, password, phone, address } = req.body;
 console.log("Validating fields..."); // Step 2

        if (!name || !email || !password || !phone || !address || !userType) {
            return res.status(400).json({ message: "Please fill all fields" });
        }

        const existingUser = await User.findOne({ email });
       console.log("Existing user check done"); // Step 3
        if (existingUser) return res.status(403).json({ message: "Email already registered" });

        const hashedPassword = await bcrypt.hash(password, 10);
console.log("Password hashed"); // Step 
        // Generate OTP
        const otp = generateOTP(6);
 
        // Send OTP to user's email
        pendingUsers[email] = { name, email, password: hashedPassword, phone, address, userType, otp, otpExpires: Date.now()+5*60*1000 };

// Send OTP without await
sendOTP(email, otp).catch(err => console.error("OTP send failed:", err));
console.log("OTP sent"); 
res.status(200).json({ message: "OTP sent to your email. Please verify." });


    } catch (err) {
      console.error("Signup Error:", err);
        res.status(500).json({ message: "Server Error", error: err.message });
    }
});
// Temporary storage for pending users awaiting OTP verification
const pendingUsers = {};

// In-memory store for pending users
router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;

    const userData = pendingUsers[email];
    if (!userData) return res.status(400).json({ message: "No pending registration found" });

    if (userData.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
    if (Date.now() > userData.otpExpires) return res.status(400).json({ message: "OTP expired" });

    // Save user in DB
    const newUser = new User({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        phone: userData.phone,
        address: userData.address,
        userType: userData.userType
    });
    await newUser.save();

    // Remove from pending
    delete pendingUsers[email];

    // Generate JWT now
    const token = jwt.sign(
        { userId: newUser._id, email: newUser.email, userType: newUser.userType },
        JWT_SECRET,
        { expiresIn: '2h' }
    );

    res.status(201).json({ 
        message: "User verified and registered successfully",
        user: {
            userId: newUser._id,
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone,
            address: newUser.address,
            userType: newUser.userType
        },
        token
    });
});
//forgot password related routes

const pendingOTP = {}; // Temporary store for forgot password OTPs

// Step 1: User enters email to reset password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "Email not registered" });

   // Generate OTP
        const otp = generateOTP(6);

        // Send OTP to user's email
        await sendOTP(email, otp);

  // Send OTP to user's email
 

  res.status(200).json({ message: "OTP sent to your email" });
});

// POST /api/auth/send-otp
router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    // Generate OTP
    const otp = generateOTP(6);

    // Store OTP temporarily (5 min expiry)
    pendingOTP[email] = {
      otp,
      otpExpires: Date.now() + 5 * 60 * 1000
    };

    // Send OTP via email
    await sendOTP(email,  `Your OTP is: ${otp}`,"Your OTP Code",);

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send OTP", error: err.message });
  }
});
router.post('/verify-forgot-otp', async (req, res) => {
  const { email, otp } = req.body;

  const otpData = pendingOTP[email];
  if (!otpData) return res.status(400).json({ message: "No OTP request found" });

  if (otpData.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
  if (Date.now() > otpData.otpExpires) return res.status(400).json({ message: "OTP expired" });

  res.status(200).json({ message: "OTP verified successfully" });
});

// Step 2: Verify OTP and allow password reset
router.post('/reset-password', async (req, res) => {
  const { email, otp, newPassword,newEPassword } = req.body;

  const otpData = pendingOTP[email];
  if (!otpData) return res.status(400).json({ message: "No OTP request found" });
  if (otpData.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
  if (Date.now() > otpData.otpExpires) return res.status(400).json({ message: "OTP expired" });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  // Remove from pending
  delete pendingOTP[email];

  res.status(200).json({ message: "Password reset successfully" });
});
// GET /api/auth/users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    if (!users || users.length === 0) {
      return res.json({ message: "No users found" });
    }
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/*router.post('/signup', async (req, res) => {
    try {
        const { name, email, userType, password, phone, address } = req.body;

        // Validate required fields
        if (!name  || !email || !password || !phone || !address || !userType) {
            return res.status(400).json({ message: "Please fill required fields" });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(403).json({ message: "Email already registered" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            phone,
            address
,userType            

        });

        await newUser.save();

        // Generate JWT (include userType from form)
        const token = jwt.sign(
            { userId: newUser._id, userType: userType ,email: newUser.email},
            JWT_SECRET,
            { expiresIn: '2h' }
        );

        // Send response (without password)
        res.status(201).json({
            message: "User created successfully",
            user: {
              userId: newUser._id,
                name: newUser.name,
                email: newUser.email,
                phone: newUser.phone,
                address: newUser.address,
                userType:newUser.userType
            },
            token
        });

    } catch (err) {
        console.error("Signup Error:", err);
        res.status(500).json({
            message: "Server Error",
            error: err.message
        });
    }
});*/

router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "Wrong email id" });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: existingUser._id, email: existingUser.email ,userType: existingUser.userType},
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    const user = {
      userId: existingUser._id,
      email: existingUser.email,
      userType: existingUser.userType,
    };

    res.status(200).json({ message: "Signin successful", token, user });
  } catch (err) {
    console.error("Signin failed:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// for fetching profile 
router.get('/profile', auth, async (req, res) => {
  try {
    const userId = req.user.id; // auth middleware se aya hua user id

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);

  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});
router.get('/users', auth, async (req, res) => {
  try {
    if (req.user.userType !== 'admin') {
  return res.status(403).json({ message: "Access denied" });
}
    const users = await User.find({userType :"customer"  }).select("-password"); // sab users

    res.status(200).json({ users }); // object me wrap kiya
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});
router.get("/users/search", auth,async (req, res) => {
  try {
    const query = req.query.query; // <-- this reads ?query=abc

    const customers = await User.find({
      userType:'customer',

      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    });

    res.status(200).json({message:"search success",customers});
  } catch (error) {
    res.status(500).json({ message: "Search failed", error });
  }
});
// PUT /api/admin/users/:id/soft-delete
router.put("/users/:id/soft-delete", auth, async (req, res) => {
  try {
    if (req.user.userType !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const userId = req.params.id;

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Customer soft-deleted successfully",
      user
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});


router.put("/users/:id/restore", auth, async (req, res) => {
  try {
    if (req.user.userType !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User restored successfully", user });

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});
router.put("/UPprofile", auth, async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware
    const { name, phone, address } = req.body;

    // Find the user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update fields if provided
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        userType: user.userType,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
