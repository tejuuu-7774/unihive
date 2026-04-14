const express = require("express");
const router = express.Router();

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// user route
router.get("/user", protect, (req, res) => {
  res.json({ message: "User route accessed" });
});

// seller route
router.get("/seller", protect, authorizeRoles("seller", "admin"), (req, res) => {
  res.json({ message: "Seller route accessed" });
});

// admin route
router.get("/admin", protect, authorizeRoles("admin"), (req, res) => {
  res.json({ message: "Admin route accessed" });
});

module.exports = router;