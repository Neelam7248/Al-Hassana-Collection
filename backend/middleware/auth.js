const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // JWT me jo fields save ki hain, unhe req.user me attach kar do
    req.user = {
      id: decoded.userId,
      email: decoded.email,       // optional, useful for fetching orders by email
      userType: decoded.userType  // admin/customer
    };

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Your session has expired. Please log in again."
      });
    }

    return res.status(401).json({
      message: "Invalid token. Please log in again."
    });
  }
};
