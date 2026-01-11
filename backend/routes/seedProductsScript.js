const mongoose = require("mongoose");
require("dotenv").config();
const Product = require("./../models/Products");
const products = require("./utils/seedProducts");

mongoose.connect(process.env.DATABASE_URL)
  .then(async () => {
    console.log("Connected to MongoDB");
    await Product.deleteMany(); // optional: remove old products
    await Product.insertMany(products);
    console.log("Products seeded successfully!");
    mongoose.connection.close();
  })
  .catch((err) => console.error("DB connection failed:", err));
