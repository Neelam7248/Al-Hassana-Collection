const express = require("express");
const router = express.Router();
const Product = require("../models/Products");
const multer = require("multer");
const uploadImages = require("./utils/uploadImages"); // Optimized Cloudinary upload

// Multer memory storage for Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// ==================== ADD PRODUCT ====================
router.post("/add", upload.array("images", 5), async (req, res) => {
  try {
    const { name, description, realPrice, discountPrice, category, gender, sizes, colors, stock } = req.body;

    if (!name || !description || !realPrice || !discountPrice || !category || !gender || !sizes || !colors) {
      return res.status(400).json({ message: "Please fill all required fields." });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    // Upload images in parallel to Cloudinary
    const uploadedImages = await uploadImages(req.files); // folder handled inside uploadImages

    // Parse JSON fields
    const parsedSizes = sizes ? JSON.parse(sizes) : { S: 0, M: 0, L: 0, XL: 0, XXL: 0 };
    const parsedColors = colors ? JSON.parse(colors) : {
      SelectedProduct:0, Red:0, Blue:0, Green:0, Black:0, White:0,
      Yellow:0, Purple:0, Orange:0, Brown:0, Gray:0
    };

    const newProduct = new Product({
      name,
      description,
      realPrice,
      discountPrice,
      category,
      gender,
      sizes: parsedSizes,
      colors: parsedColors,
      images: uploadedImages,
      stock,
    });

    await newProduct.save();
    res.status(201).json({ message: "✅ Product added successfully!", product: newProduct });

  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ==================== GET PRODUCTS (Paginated) ====================
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const products = await Product.find({}, "name realPrice discountPrice images sizes colors category stock")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json(products);

  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ==================== UPDATE PRODUCT ====================
router.put("/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProduct) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "✅ Product updated", product: updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ==================== DELETE PRODUCT ====================
router.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "🗑️ Product deleted successfully!" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ==================== INVENTORY ====================
router.get("/inventory", async (req, res) => {
  try {
    const products = await Product.find();
    const totalProducts = products.length;
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);

    res.json({ totalProducts, totalStock, products });
  } catch (error) {
    console.error("Error fetching inventory:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ==================== GET PRODUCTS BY CATEGORY ====================
router.get("/byCategory", async (req, res) => {
  try {
    let { category } = req.query;
    if (!category) return res.status(400).json({ message: "Category query is required" });

    category = category.toLowerCase();
    const validCategories = ["jackets", "t-shirts", "jeans", "caps","shirts","pants","suits","hoodies"];
    if (!validCategories.includes(category)) return res.status(400).json({ message: "Invalid category" });

    const products = await Product.find({ category });
    if (products.length === 0) {
      return res.status(404).json({ message: `New products are coming soon in ${category}. All sold.` });
    }

    res.status(200).json(products);

  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({ message: "Failed to fetch products", error: error.message });
  }
});

module.exports = router;
