// backend/models/Order.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customer: {
      name: String,
      email:String,
      phone: String,
      postalCode: String,
      address: String,
      paymentMethod: String,
    },
    items: [
      {
        name: String,
        price: Number,
        selectedSize: String,
        selectedColor: String,
        quantity: Number,
        images: [String],
      },
    ],
    subtotal: Number,
    serviceCharge: Number,
    grandTotal: Number,
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered"],
      default: "Pending", // new orders default Pending
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports=Order;
