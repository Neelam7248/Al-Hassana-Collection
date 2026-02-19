const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Review = require("../models/reviews");
const multer = require("multer");
const uploadImages = require("./utils/uploadImages"); // Cloudinary helper
const auth = require("../middleware/auth");

// Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ---------------- GET reviews ----------------
router.get("/:productId", async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = "-createdAt" } = req.query;
    const skip = (page - 1) * limit;
    const productId = req.params.productId;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid productId" });
    }

    const [items, count] = await Promise.all([
  Review.find({ productId, moderated: true }) // fetch all reviews, no pagination
    .sort(sort)
    .lean(),
  Review.countDocuments({ productId, moderated: true }),
]);

    // Rating breakdown
    const agg = await Review.aggregate([
      { $match: { productId:new mongoose.Types.ObjectId(productId), moderated: true } },
      { $group: { _id: "$rating", count: { $sum: 1 } } },
    ]);

    const breakdown = [1, 2, 3, 4, 5].reduce((acc, r) => {
      const found = agg.find((a) => a._id === r);
      acc[r] = found ? found.count : 0;
      return acc;
    }, {});

    const averageRating =
      count > 0
        ? (agg.reduce((sum, a) => sum + a._id * a.count, 0) / count).toFixed(1)
        : 0;

    res.json({ items, count, breakdown, averageRating });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.post("/", auth, upload.array("images", 5), async (req, res) => {
  try {
    const { productId, name, rating, title, content, youtubeUrl } = req.body;

    if (!productId || !name || !rating || !content)
      return res.status(400).json({ message: "Required fields missing" });

    if (!mongoose.Types.ObjectId.isValid(productId))
      return res.status(400).json({ message: "Invalid productId" });

    // Upload images using your existing helper
    let images = [];
    if (req.files && req.files.length > 0) {
      images = await uploadImages(req.files, "product_reviews");
      // now images is just an array of URLs
    }

    const review = new Review({
      productId: new mongoose.Types.ObjectId(productId),
      name,
      rating,
      title,
      content,
      youtubeUrl,
      images,       // <-- directly assign array of strings
      moderated: true,
    });

    await review.save();
    res.status(201).json({ success: true, message: "Review added successfully", review });
  } catch (err) {
    console.error("Error adding review:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
