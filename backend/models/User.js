// models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  address: String,
  userType: { type: String, enum: ["admin", "customer"], default: "customer" },
  department: { type: String, required: function() { return this.userType === 'admin'; } },
  employeeCode: { type: String, unique: true, sparse: true }, // only for admins
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  otp: String,
  otpExpires: Date,
  createdAt: { type: Date, default: Date.now }
}
);

module.exports = mongoose.model("User", UserSchema);
