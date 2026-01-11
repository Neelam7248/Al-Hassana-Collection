const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("../../models/Products");

dotenv.config();

// MongoDB connection
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

const categories = ["jackets", "t-shirts", "caps", "suits", "shirts", "hoodies", "pants", "jeans"];
const genders = ["Male", "Female", "Unisex"];
const colors = ["Red", "Blue", "Black", "White", "Green", "Yellow", "Grey", "Brown"];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomSizes() {
  return {
    S: randomInt(0, 20),
    M: randomInt(0, 20),
    L: randomInt(0, 20),
    XL: randomInt(0, 20),
    XXL: randomInt(0, 20),
  };
}

function generateProducts(count = 100) {
  const products = [];

  for (let i = 1; i <= count; i++) {
    const category = categories[randomInt(0, categories.length - 1)];
    const gender = genders[randomInt(0, genders.length - 1)];
    const color = [colors[randomInt(0, colors.length - 1)]];
    const realPrice = randomInt(1000, 5000);
    const discountPrice = Math.floor(realPrice * (randomInt(70, 90) / 100));

    products.push({
      name: `${category.charAt(0).toUpperCase() + category.slice(1)} Product ${i}`,
      description: `This is a ${category} for ${gender} with high quality material.`,
      realPrice,
      discountPrice,
      category,
      gender,
      sizes: randomSizes(),
      color,
      images: [`https://via.placeholder.com/400x400?text=Product+${i}`],
      stock: randomInt(10, 100),
      isDummy: true, // ⭐ important
    });
  }

  return products;
}

async function seed() {
  try {
    console.log("Deleting old dummy products...");
    await Product.deleteMany({ isDummy: true });

    console.log("Generating 100 dummy products...");
    const products = generateProducts(100);

    await Product.insertMany(products);
    console.log("✅ 100 dummy products added successfully!");
  } catch (err) {
    console.error("❌ Error seeding products:", err);
  } finally {
    mongoose.disconnect();
  }
}

/**
 * 🔐 IMPORTANT LINE
 * Seed sirf tab chale jab file direct run ho
 */
if (require.main === module) {
  seed();
}
