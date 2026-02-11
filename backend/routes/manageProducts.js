// routes/products.js
const express = require("express");
const router = express.Router();
const Product = require("../models/Products");
const multer = require("multer");
const uploadImages = require("./utils/uploadImages"); // Cloudinary helper
const { categoriesConfig } = require("../config/CategoriesConfig"); // make sure it's exported
const auth = require("../middleware/auth");

// Multer memory storage for Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ==================== ADD PRODUCT ====================
// ==================== ADD PRODUCT ====================
router.post(
  "/add",
  auth,
  upload.array("images", 5),
  async(req, res) => {
    try {
      if (!req.body.product) {
        return res.status(400).json({ message: "Product data missing" });
      }

      const productData = JSON.parse(req.body.product);

      const {
        name,
        description,
        category,
        subCategory,
        gender,
        variants,
        totalStock,
      } = productData;

      // 🔐 Basic validation
      if (!name || !description || !category || !subCategory) {
        return res.status(400).json({ message: "Required fields missing" });
      }

      if (!variants || variants.length === 0) {
        return res.status(400).json({ message: "At least one variant is required" });
      }

      // 🔐 Gender validation (ONLY for Ehram)
      if (
        category === "hajj-umrah" &&
        ["ehram-men", "ehram-women"].includes(subCategory)
      ) {
        if (!gender) {
          return res.status(400).json({ message: "Gender required for Ehram" });
        }
      }

      // 🔹 Validate subCategory via categoriesConfig (slug based)
      let validSubCategory = false;
      for (const key in categoriesConfig) {
        const subs = categoriesConfig[key].subCategories;
        if (subs[subCategory]) {
          validSubCategory = true;
          break;
        }
      }

      if (!validSubCategory) {
        return res.status(400).json({ message: "Invalid subCategory" });
      }

      // 🔹 Upload images to Cloudinary
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "Images are required" });
      }

      const uploadedImages = await uploadImages(req.files);

      // ✅ Create product
      const newProduct = new Product({
        name,
        description,
        category,
        subCategory,
        gender: gender || "",
        variants,
        totalStock,
        images: uploadedImages,

        createdBy: req.user.id,
        createdByName: req.user.name,
        createdByEmail: req.user.email,
        reviews: [],
      });

      await newProduct.save();

      res.status(201).json({
        success: true,
        message: "✅ Product added successfully!",
        product: newProduct,
      });
    } catch (error) {
      console.error("Error adding product:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// ==================== GET PRODUCTS ====================
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const products = await Product.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ==================== GET PRODUCTS BY CATEGORY ====================
// ==================== GET PRODUCTS BY SUBCATEGORY SLUG ====================
router.get("/byCategory", async (req, res) => {
  try {
    let { subCategory } = req.query;

    if (!subCategory) {
      return res.status(400).json({ message: "SubCategory slug is required." });
    }

    subCategory = subCategory.toLowerCase();

    // 🔹 Find parent category automatically
    let parentCategorySlug = null;

    for (const categoryKey of Object.keys(categoriesConfig)) {
      const subCats = categoriesConfig[categoryKey].subCategories;
      for (const subKey of Object.keys(subCats)) {
        if (subCats[subKey].slug.toLowerCase() === subCategory) {
          parentCategorySlug = categoriesConfig[categoryKey].slug.toLowerCase();
          break;
        }
      }
      if (parentCategorySlug) break;
    }

    if (!parentCategorySlug) {
      return res.status(404).json({ message: "Invalid subCategory slug." });
    }

    // 🔹 Fetch products by category slug and subCategory slug
    const products = await Product.find({
      category: parentCategorySlug,
      subCategory: subCategory,
    });

    

    res.status(200).json(products);

  } catch (error) {
    console.error("Error fetching products by subCategory slug:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/:id", upload.array("images"), async (req, res) => {
  try {
    let productData = {};
    if (req.body.product) {
      productData = JSON.parse(req.body.product); // Parse JSON data from FormData
    }

    // Handle uploaded images
    if (req.files && req.files.length > 0) {
      const imagePaths = req.files.map(file => file.filename); // Save only filenames, adjust according to your model
      productData.images = imagePaths;
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, productData, { new: true });
    if (!updatedProduct) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "✅ Product updated", product: updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Server error", error: error.message   });
  }
})
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

module.exports = router;
