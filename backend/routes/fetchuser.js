// server.js or routes/users.js
const express = require("express");
const router = express.Router();
const User = require("./models/User"); // your User model

// GET all users
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

module.exports = router;
