const express = require("express");
const router = express.Router();

const {
  createOrder,
  updateOrderStatus,
  getMyOrders,
  cancelOrder,
  getSellerOrders,
} = require("../controllers/orderController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// 👤 Buyer
router.post("/", protect, createOrder);
router.get("/my", protect, getMyOrders);
router.put("/cancel/:id", protect, cancelOrder);

// 🏪 Seller
router.get("/seller", protect, authorizeRoles("seller", "admin"), getSellerOrders);
router.put("/:id", protect, authorizeRoles("seller", "admin"), updateOrderStatus);

module.exports = router;
