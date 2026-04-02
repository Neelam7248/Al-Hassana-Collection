// routes/seoContent.js
const express = require("express");
const router = express.Router();
const SeoContent = require("../models/SEOContent");

// -----------------------
// ➕ Add SEO Content
// -----------------------
router.post("/add", async (req, res) => {
  const { category, subCategory, title, description, keywords } = req.body;

  if (!category || !subCategory || !title || !description) {
    return res.status(400).json({ success: false, message: "All fields required" });
  }

  try {
    // Check if content already exists for this category/subcategory
    let existing = await SeoContent.findOne({ category, subCategory });

    if (existing) {
      // Update existing
      existing.title = title;
      existing.description = description;
      existing.keywords = keywords;
      await existing.save();
      return res.json({ success: true, message: "SEO content updated" });
    }

    // Create new
    const seoContent = new SeoContent({ category, subCategory, title, description, keywords });
    await seoContent.save();

    res.json({ success: true, message: "SEO content added" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// -----------------------
// 🔎 Get SEO Content by Category/Subcategory
// -----------------------
router.get("/:category/:subCategory", async (req, res) => {
  const { category, subCategory } = req.params;
  try {
    const content = await SeoContent.findOne({ category, subCategory });
    if (!content) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;