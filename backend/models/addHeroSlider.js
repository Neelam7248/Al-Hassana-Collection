const mongoose = require("mongoose");

const sliderSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
  },
  link: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true, // Cloudinary URL
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Slider", sliderSchema);