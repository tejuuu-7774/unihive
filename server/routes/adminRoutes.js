const express = require("express");

const {
  getAllUsers,
  getVerificationRequests,
  banUser,
  unbanUser,
  getAllProducts,
  moderateProduct,
  getAllOrders,
  deleteUserByAdmin,
} = require("../controllers/adminController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect, authorizeRoles("admin"));

router.get("/users", getAllUsers);
router.get("/verifications", getVerificationRequests);
router.put("/users/:id/ban", banUser);
router.put("/users/:id/unban", unbanUser);
router.delete("/users/:id", deleteUserByAdmin);
router.get("/products", getAllProducts);
router.put("/products/:id/moderate", moderateProduct);
router.get("/orders", getAllOrders);

module.exports = router;
