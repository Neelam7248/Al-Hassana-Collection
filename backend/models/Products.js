const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    realPrice: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
      lowercase: true,
    },
    subCategory: {
      type: String,
      required: true,
      lowercase: true,

    },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Unisex"],
    },

    // ✅ Sizes with individual stock
    sizes: {
      S: { type: Number, default: 0 },
      M: { type: Number, default: 0 },
      L: { type: Number, default: 0 },
      XL: { type: Number, default: 0 },
      XXL: { type: Number, default: 0 },
    },

   colors: {
    selectedProduct: { type: Number, default: 0 },
      Red: { type: Number, default: 0 },
      Blue: { type: Number, default: 0 },
      Green: { type: Number, default: 0 },
      Black: { type: Number, default: 0 },
      White: { type: Number, default: 0 },
      Yellow: { type: Number, default: 0 },
      Purple: { type: Number, default: 0 },
      Orange: { type: Number, default: 0 },
      Brown: { type: Number, default: 0 },
      Gray: { type: Number, default: 0 },
    },
    images: {
      type: [String], // array of image URLs
      default: [],
    },
    stock: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Admin or seller reference
    },
    createdByName: {
      type: String,
    },
    createdByEmail: {
      type: String,
    },
    rating: {
      average: { type: Number, default: 0, min: 0 },
      count: { type: Number, default: 0, min: 0 },
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    reviews: [
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    rating: { type: Number, required: true },
    comment: { type: String },
    createdAt: { type: Date, default: Date.now }
  }
],


  },
  { timestamps: true }
);
productSchema.index({ createdAt: -1 });
productSchema.index({ category: 1 });
productSchema.index({ gender: 1 });

module.exports = mongoose.model("Product", productSchema);
