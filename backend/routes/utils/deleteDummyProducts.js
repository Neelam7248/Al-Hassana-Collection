const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("../../models/Products");

dotenv.config();

mongoose.connect(process.env.DATABASE_URL);

async function deleteDummyProducts() {
  const result = await Product.deleteMany({
    name: { $regex: "Product" }
  });

  console.log(`✅ ${result.deletedCount} dummy products deleted`);
  mongoose.disconnect();
}

deleteDummyProducts();
