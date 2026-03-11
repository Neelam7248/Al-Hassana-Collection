const express = require("express");
const router = express.Router();
const { Category, Discussion, Post } = require("../../models/forum");
const auth = require("../../middleware/auth"); // aapka auth middleware

// -----------------------------
// Get all categories
// -----------------------------
router.get("/categories", async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// -----------------------------
// Get discussions by category & subcategory
// -----------------------------
router.get("/discussions/:categorySlug/:subSlug", async (req, res) => {
    try {
        const { categorySlug, subSlug } = req.params;
        const discussions = await Discussion.find({ categorySlug, subSlug })
            .populate("userId", "name") // show username
            .sort({ createdAt: -1 });
        res.json(discussions);
    } catch (err) {
        console.error("Failed to fetch discussions:", err.message);
        res.status(500).json({ message: err.message });
    }
});

// -----------------------------
// Create a new discussion (requires login)
// -----------------------------
router.post("/discussions", auth, async (req, res) => {
  try {
    const { title, content, categorySlug, subSlug } = req.body;

    // req.user must exist if auth middleware works
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: No user info" });
    }

    const discussion = new Discussion({
      title,
      content,
      categorySlug,
      subSlug,
      userId: req.user.id,  // ✅ userId comes from token
    });

    await discussion.save();
    res.status(201).json(discussion);
  } catch (err) {
    console.error("Failed to create discussion:", err.message);
    res.status(400).json({ message: err.message });
  }
});
// -----------------------------
// Get posts for a discussion
// -----------------------------
router.get("/posts/:discussionId", async (req, res) => {
    try {
        const posts = await Post.find({ discussionId: req.params.discussionId })
            .populate("userId", "name")
            .sort({ createdAt: 1 });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// -----------------------------
// Create a post/reply (requires login)
// -----------------------------
router.post("/posts", auth, async (req, res) => {
    try {
        const { discussionId, content } = req.body;
        const post = new Post({
            discussionId,
            content,
            userId: req.user._id,
        });
        await post.save();
        res.status(201).json(post);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;