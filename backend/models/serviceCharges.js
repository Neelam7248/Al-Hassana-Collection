const mongoose = require("mongoose");

const ServiceChargeSchema = new mongoose.Schema({
  city: { type: String, required: true },
  postalCode: { type: String },
  charge: { type: Number, required: true },

  // New fields for user info
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("ServiceCharge", ServiceChargeSchema);