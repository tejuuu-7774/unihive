const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect route (logged-in users)
exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      if (req.user.isBanned) {
        return res.status(403).json({ message: "User is banned" });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "No token" });
  }
};

// Role-based access
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Role (${req.user.role}) not allowed`,
      });
    }
    next();
  };
};

// Seller-only access (must be verified)
exports.isSeller = (req, res, next) => {
  if (req.user.role !== "seller" || !req.user.isVerified) {
    return res.status(403).json({
      message: "Only verified sellers can perform this action",
    });
  }
  next();
};