const express = require("express");
const Order = require("../models/Orders");
const auth = require("../middleware/auth");
const ORDER_STATUS = require("../config/orderStatus");
const router = express.Router();


// =========================
// 📦 CREATE ORDER
// =========================
router.post("/", auth, async (req, res) => {
  try {
    const order = new Order({
      userId: req.user.id,
      customer: req.body.customer,
      items: req.body.items,
      subtotal: req.body.subtotal,
      serviceCharge: req.body.serviceCharge,
      grandTotal: req.body.grandTotal,
      status: ORDER_STATUS.PENDING,
    });

    await order.save();

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// =========================
// 📦 GET ORDERS (ROLE BASED)
// =========================
router.get("/", auth, async (req, res) => {
  try {
    let orders;

    if (req.user.userType === "deliveryBoy") {
      orders = await Order.find({
        deliveryBoy: req.user.id,
      }).sort({ createdAt: -1 });

    } else if (req.user.userType === "customer") {
      orders = await Order.find({
        "customer.email": req.user.email,
      }).sort({ createdAt: -1 });

    }else if (req.user.userType === "admin") {

 const status = req.query.status?.toLowerCase();

  let filter = {};

  if (status && status !== "all") {
    filter.status = status;
  }

  orders = await Order.find(filter)
    .sort({ createdAt: -1 });
} else {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// =========================
// 🛵 ASSIGN ORDER (ADMIN ONLY)
// =========================
router.put("/:orderId/assign", auth, async (req, res) => {
  try {
    if (req.user.userType !== "admin") {
      return res.status(403).json({ message: "Only admin allowed" });
    }

    const { deliveryBoyId } = req.body;

    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.deliveryBoy = deliveryBoyId;
   order.status = ORDER_STATUS.ASSIGNED;

    await order.save();

    res.json({order});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// =========================
// 🔄 UPDATE STATUS (ADMIN + DELIVERY BOY)
// =========================
router.put("/:orderId/status", auth, async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 👨‍💼 ADMIN: full control
    if (req.user.userType === "admin") {
      order.status = status;
    }

    // 🚚 DELIVERY BOY: limited control
    else if (req.user.userType === "deliveryBoy") {
      if (!order.deliveryBoy || order.deliveryBoy.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not your order" });
      }
const allowed = [
  ORDER_STATUS.PICKED,

  ORDER_STATUS.OUT_FOR_DELIVERY,

  ORDER_STATUS.DELIVERED,
];
      if (!allowed.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      order.status = status;
    }

    else {
      return res.status(403).json({ message: "Access denied" });
    }

    await order.save();

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// =========================
// 📊 DELIVERY STATS (ADMIN ONLY)
// =========================
router.get("/delivery-stats", auth, async (req, res) => {
  try {
    if (req.user.userType !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    const result = await Order.aggregate([
      {
        $group: {
          _id: "$deliveryBoy",
          totalOrders: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "deliveryBoy",
        },
      },
      { $unwind: "$deliveryBoy" },
      {
        $project: {
          totalOrders: 1,
          "deliveryBoy.name": 1,
          "deliveryBoy.email": 1,
        },
      },
    ]);

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// =========================
// 🛵 ADMIN: VIEW ONE DELIVERY BOY ORDERS
// =========================
router.get("/by-delivery-boy/:id", auth, async (req, res) => {
  try {
    if (req.user.userType !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    const orders = await Order.find({
      deliveryBoy: req.params.id,
    });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// =========================
// 🚚 DELIVERY BOY OWN ORDERS
// =========================
router.get("/my-orders", auth, async (req, res) => {
  try {
    if (req.user.userType !== "deliveryBoy") {
      return res.status(403).json({ message: "Delivery only" });
    }

    const orders = await Order.find({
      deliveryBoy: req.user.id,
    });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;