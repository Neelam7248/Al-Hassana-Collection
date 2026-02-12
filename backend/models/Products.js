const mongoose = require("mongoose");

/**
 * =========================
 * Variant Schema
 * =========================
 */
const variantSchema = new mongoose.Schema(
  {
    size: {
      type: String, // S, M, L, XL, 30ml, 100ml etc
      trim: true,
    },

    color: {
      type: String, // White, Black, Red
      trim: true,
    },

    realPrice: {
      type: Number, // MRP
      required: true,
      min: 0,
    },

    discountPrice: {
      type: Number, // Selling price
      required: true,
      min: 0,
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

/**
 * =========================
 * Product Schema
 * =========================
 */
const productSchema = new mongoose.Schema(
  {
    // 🔹 Basic Info
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },
notes: { type: String, default: "" },
whatIsThis: { type: String, default: "" },
howToUse: { type: String, default: "" },

    category: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    subCategory: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    // 🔹 Gender (only for Ehram)
    gender: {
      type: String,
      enum: ["Male", "Female", "Unisex", ""],
      default: "",
    },

    // 🔥 Variants
    variants: {
      type: [variantSchema],
      required: true,
      validate: {
        validator: v => Array.isArray(v) && v.length > 0,
        message: "At least one variant is required",
      },
    },

    // 🔹 Auto calculated
    totalStock: {
      type: Number,
      default: 0,
    },

    // 🔹 Images
    images: {
      type: [String],
      default: [],
    },

    // 🔹 Featured
    isFeatured: {
      type: Boolean,
      default: false,
    },

    // 🔹 Ratings
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },

    // 🔹 Admin info
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    createdByName: {
      type: String,
      required: true,
    },

    createdByEmail: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

/**
 * =========================
 * 🔁 Auto calculate total stock
 * (NO next → NO ERROR)
 * =========================
 */
productSchema.pre("save", function () {
  this.totalStock = this.variants.reduce(
    (sum, v) => sum + (v.stock || 0),
    0
  );
});

// =========================
// 🔁 Auto calculate total stock on update
// (NO next → NO ERROR)
// =========================
productSchema.pre("findOneAndUpdate", function () {
  const update = this.getUpdate();

  if (update.variants) {
    const total = update.variants.reduce(
      (sum, v) => sum + (v.stock || 0),
      0
    );

    this.setUpdate({
      ...update,
      totalStock: total,
    });
  }
});

// =========================
// 🔁 Prevent duplicate variants
// (NO next → NO ERROR)//pehle next use kia tha ab hata dia error throw kr dia tha usne
// =========================
productSchema.pre("save", function () {
  const seen = new Set();

  for (const v of this.variants) {
    const key = `${v.size || ""}-${v.color || ""}`.toLowerCase();

    if (seen.has(key)) {
      throw new Error(`Duplicate variant detected: ${v.size} ${v.color}`);
    }
    seen.add(key);
  }
});


//------------------------------------------------
// 🔁 Validate discountPrice < realPrice
// (NO next → NO ERROR)
// =========================
variantSchema.pre("validate", function () {
  if (this.discountPrice > this.realPrice) {
    throw new Error("Discount price cannot be greater than real price");
  }
});



/**
 * =========================
 * Indexes
 * =========================
 */
productSchema.index({ category: 1 });
productSchema.index({ subCategory: 1 });
productSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Product", productSchema);
