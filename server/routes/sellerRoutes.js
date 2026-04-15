const express = require("express");

const { getSellerAnalytics } = require("../controllers/sellerController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/analytics",
  protect,
  authorizeRoles("seller", "admin"),
  getSellerAnalytics
);

module.exports = router;
