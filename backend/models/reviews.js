const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Product" },
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    title: { type: String },
    content: { type: String, required: true },
    youtubeUrl: { type: String },
    images: {
      type: [String], // <-- store just URL strings
      default: [],
    },
    verifiedPurchase: { type: Boolean, default: false },
    moderated: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
