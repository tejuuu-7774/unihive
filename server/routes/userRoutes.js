const express = require("express");
const router = express.Router();

const {
  requestVerification,
  approveSeller,
  rejectSeller,
} = require("../controllers/userController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// user requests verification
router.put("/verify", protect, requestVerification);

// admin actions
router.put("/approve/:id", protect, authorizeRoles("admin"), approveSeller);
router.put("/reject/:id", protect, authorizeRoles("admin"), rejectSeller);

module.exports = router;