// models/SeoContent.js
const mongoose = require("mongoose");

const seoContentSchema = new mongoose.Schema(
  {
    category: { type: String, required: true }, // slug
    subCategory: { type: String, required: true }, // slug
    title: { type: String, required: true },
    description: { type: String, required: true },
    keywords: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("SeoContent", seoContentSchema);