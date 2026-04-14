const express = require("express");
const router = express.Router();

const {
  requestVerification,
  approveSeller,
  rejectSeller,
  getProfile,
  updateProfile,
  deleteAccount,
} = require("../controllers/userController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// 🔐 User routes
router.get("/me", protect, getProfile);
router.put("/me", protect, updateProfile);
router.delete("/me", protect, deleteAccount);

// 🎓 Verification
router.put("/verify", protect, requestVerification);

// 🛠 Admin actions
router.put("/approve/:id", protect, authorizeRoles("admin"), approveSeller);
router.put("/reject/:id", protect, authorizeRoles("admin"), rejectSeller);

module.exports = router;