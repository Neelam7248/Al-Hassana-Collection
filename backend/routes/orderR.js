// backend/routes/orderRoutes.js
 const express=require("express") ;
const Order=require("./../models/Orders") ; // we'll create this next
const auth = require("../middleware/auth");
const router = express.Router();

// 📦 POST: Create new order
router.post("/", auth, async (req, res) => {
  try {
    const orderData = {
      userId: req.user.id,          // logged-in user id from auth middleware
      customer: req.body.customer,  // name, phone, postalCode, address
      items: req.body.items,
      subtotal: req.body.subtotal,
      serviceCharge: req.body.serviceCharge,
      grandTotal: req.body.grandTotal,
      paymentMethod: req.body.customer.paymentMethod,
      createdAt: new Date(),
    };

    const order = new Order(orderData);
    await order.save();

    res.status(201).json({ message: "Order placed successfully ✅", order });
  } catch (error) {
    console.error("❌ Error saving order:", error);
    res.status(500).json({ error: "Failed to place order" });
  }
});
// 🧾 GET: Fetch all orders (for admin or testing)



// GET orders
router.get("/", auth, async (req, res) => {
  try {
    let orders;

    if (req.user.userType === "admin") {
      // Admin: fetch all orders
      orders = await Order.find().sort({ createdAt: -1 });
    } else {
      // Customer: fetch only their orders using email
      orders = await Order.find({ "customer.email": req.user.email }).sort({ createdAt: -1 });
    }

    res.json(orders);
  } catch (error) {
    console.error("Fetch orders error:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

router.put("/:orderId/status", auth,  async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    // Update status + updatedAt timestamp
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status, updatedAt: new Date() }, // <-- yahan add kiya
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports=router;
