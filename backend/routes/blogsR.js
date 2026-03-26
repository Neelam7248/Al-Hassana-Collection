const express = require("express");
const router = express.Router();
const Blog = require("../models/blogs");

const multer = require("multer");
const uploadImages = require("./utils/uploadImages");

const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * =========================
 * 🔥 SLUG GENERATOR (FIXED)
 * =========================
 */
const generateSlug = async (title, customSlug) => {
  let baseSlug = customSlug || title;

  baseSlug = baseSlug
    .toLowerCase()
    .trim()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");

  let finalSlug = baseSlug;
  let counter = 1;

  while (await Blog.findOne({ slug: finalSlug })) {
    finalSlug = `${baseSlug}-${counter}`;
    counter++;
  }

  return finalSlug;
};

/**
 * =========================
 * ➕ CREATE BLOG
 * =========================
 */
router.post("/add", upload.array("images"), async (req, res) => {
  try {
    let { title, description, content, category, tags, slug } = req.body;

    // SAFE TAGS
    try {
      tags = JSON.parse(tags || "[]");
    } catch {
      tags = [];
    }

    if (!title || !content) {
      return res.status(400).json({ message: "Title & Content required" });
    }

    // 🔥 AUTO SLUG FIX
    const finalSlug = await generateSlug(title, slug);

    // IMAGE UPLOAD
    let imageUrls = [];

    if (req.files && req.files.length > 0) {
      imageUrls = await uploadImages(req.files, "blog");
    }

    const blog = new Blog({
      title,
      description,
      content,
      category,
      tags,
      slug: finalSlug,
      images: imageUrls,
    });

    await blog.save();

    res.json({
      success: true,
      blog,
    });

  } catch (error) {
    console.log("BLOG ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * =========================
 * 📄 GET ALL BLOGS
 * =========================
 */
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });

    res.json({ success: true, blogs });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * =========================
 * 📖 GET SINGLE BLOG
 * =========================
 */
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    res.json({ success: true, blog });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;