const express = require("express");
const router = express.Router();
const ServiceCharge = require("../models/serviceCharges");
const auth = require("../middleware/auth"); // your middleware

// Get all charges
router.get("/", auth, async (req, res) => {
  try {
    const charges = await ServiceCharge.find();
    res.json(charges);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
// Add new charge
// Add new charge with city check
router.post("/", auth, async (req, res) => {
  try {
    const { city, postalCode, charge } = req.body;
    const user = req.user;

    // Check if city already exists
    const existingCity = await ServiceCharge.findOne({ city: city.trim().toLowerCase() });
    if (existingCity) {
      return res.status(400).json({
        message: `Service charge for "${city}" already exists. You can only edit it.`,
      });
    }

    const newCharge = new ServiceCharge({
city: city.trim().toLowerCase()     ,
 postalCode,
      charge,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
    });

    await newCharge.save();
    res.json(newCharge);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
// Update charge
router.put("/:id", auth, async (req, res) => {
  const { city, postalCode, charge } = req.body;
  try {
    const updated = await ServiceCharge.findByIdAndUpdate(
      req.params.id,
      { city, postalCode, charge },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete charge
router.delete("/:id", auth, async (req, res) => {
  try {
    await ServiceCharge.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;