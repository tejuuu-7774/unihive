const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect route (logged-in users)
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token, authorization denied",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isBanned) {
      return res.status(403).json({
        success: false,
        message: "User is banned",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, token failed",
    });
  }
};

// Role-based access
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }
    
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