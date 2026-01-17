const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  address: String,
  userType: { type: String, enum: ["admin", "customer"], default: "customer" },
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  verificationToken: String, // email verification link
  otp: String,                // optional: for forgot password
  otpExpires: Date,
  otpAttempts: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model("User", UserSchema);