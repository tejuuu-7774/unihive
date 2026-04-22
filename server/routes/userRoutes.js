const express = require("express");

const {
  requestVerification,
  approveSeller,
  rejectSeller,
  getProfile,
  downgradeSeller,
  updateProfile,
  deleteAccount,
} = require("../controllers/userController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const { uploadStudentIdCard } = require("../middleware/uploadMiddleware");

const router = express.Router();

router.get("/me", protect, getProfile);
router.put("/me", protect, updateProfile);
router.delete("/me", protect, deleteAccount);

router.put(
  "/verify",
  protect,
  uploadStudentIdCard.single("studentIdCard"),
  requestVerification
);

router.put("/approve/:id", protect, authorizeRoles("admin"), approveSeller);
router.put("/reject/:id", protect, authorizeRoles("admin"), rejectSeller);

router.put("/downgrade/:id", protect, authorizeRoles("admin"), downgradeSeller);

module.exports = router;
