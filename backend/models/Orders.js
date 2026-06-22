// backend/models/Order.js
const mongoose = require("mongoose");
const ORDER_STATUS = require("../config/orderStatus");
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
      // ✅ UPDATED STATUS (add delivery states)
    status: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.PENDING
    },

    // ✅ NEW FIELD (VERY IMPORTANT)
    deliveryBoy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports=Order;
