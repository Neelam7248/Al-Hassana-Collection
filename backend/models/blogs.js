const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String
    },

    content: {
      type: String,
      required: true
    },

    category: {
      type: String,
      default: "general"
    },

    // =========================
    // SEO FRIENDLY TAGS (ARRAY)
    // =========================
    tags: {
      type: [String],
      default: []
    },

    slug: {
      type: String,
      unique: true,
      required: true,
      index: true
    },

    images: {
      type: [String],
      default: []
    },

    // =========================
    // SEO EXTENSION (VERY IMPORTANT)
    // =========================
    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String]
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);