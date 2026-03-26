const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const Slider = require("../models/addHeroSlider"); // HeroSlider model
const auth = require("../middleware/auth");
// Multer memory storage for image upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /api/slides => Add new hero slider (Admin only)
router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    const { title, subtitle, link } = req.body;

    // Required fields check
    if (!title || !link || !req.file) {
      return res.status(400).json({ message: "Title, Link, and Image are required!" });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload_stream(
      { folder: "hero-slides", resource_type: "image" },
      async (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return res.status(500).json({ message: "Image upload failed" });
        }

        // Create new slider document
        const newSlide = new Slider({
          title,
          subtitle,
          link,
          imageUrl: result.secure_url,
          cloudinaryId: result.public_id, // for future deletion if needed
        });

        await newSlide.save();

        res.status(201).json(newSlide);
      }
    );

    // Pipe the multer buffer to cloudinary upload_stream
    result.end(req.file.buffer);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/slides => Get all slides
router.get("/", async (req, res) => {
  try {
    const slides = await Slider.find().sort({ createdAt: -1 });
    res.json(slides);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/slides/:id => Delete slide (Admin only)
router.delete("/:id", auth,  async (req, res) => {
  try {
    const slide = await Slider.findById(req.params.id);
    if (!slide) return res.status(404).json({ message: "Slide not found" });

    // Delete from Cloudinary
    if (slide.cloudinaryId) {
      await cloudinary.uploader.destroy(slide.cloudinaryId);
    }

    await Slider.findByIdAndDelete(req.params.id);
    res.json({ message: "Slide deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;