const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },

  password: {
    type: String,
    required: function () {
      return !this.googleId;
    }
  },

  googleId: {
    type: String,
    unique: true,
    sparse: true
  },

  phone: {
    type: String,
    required: true
  },

  address: {
    type: String,
    required: true
  },

  userType: {
    type: String,
    enum: ["admin", "customer", "deliveryBoy"],
    default: "customer"
  },
// department for the use of admin and delivery boy
  department: {
    type: String,
    trim: true,
    required: function () {
      return this.userType === "admin" || this.userType === "deliveryBoy";
    }
  },

  employeeCode: {
    type: String,
    unique: true,
    sparse: true
  },

  isActive: {
    type: Boolean,
    default: true
  },

  isVerified: {
    type: Boolean,
    default: false
  },

  verificationToken: String,
  verificationTokenExpiry: Date,

  otp: String,
  otpExpires: Date

}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);