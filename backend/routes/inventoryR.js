const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const Product = require("../models/Products");

// GET INVENTORY (Admin only)
router.get("/", auth, async (req, res) => {
  try {
    // admin check
    if (req.user.userType !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const products = await Product.find();

    const totalProducts = products.length;

    const totalStock = products.reduce((sum, product) => {
      if (product.sizes && typeof product.sizes === "object") {
        return (
          sum +
          Object.values(product.sizes).reduce((a, b) => a + b, 0)
        );
      }
      return sum + (product.stock || 0);
    }, 0);

    res.json({
      totalProducts,
      totalStock,
      products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
router.put(
  "/products/:id/featured",
  auth,
  async (req, res) => {
    try {

      if (req.user.userType !== "admin") {
        return res
          .status(403)
          .json({
            message: "Access denied",
          });
      }

      const product =
        await Product.findByIdAndUpdate(
          req.params.id,
          {
            isFeatured:
              req.body.isFeatured,
          },
          { new: true }
        );

      if (!product) {
        return res
          .status(404)
          .json({
            message:
              "Product not found",
          });
      }

      res.json({
        message:
          "Featured status updated",

        product,
      });

    } catch (error) {

      console.log(error);

      res
        .status(500)
        .json({
          message:
            "Server error",
        });
    }
  }
);

module.exports = router;