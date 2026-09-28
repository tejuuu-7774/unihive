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
  getVerificationDocument,
} = require("../controllers/adminController");
const { getReports, resolveReport } = require("../controllers/reportController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect, authorizeRoles("admin"));

router.get("/users", getAllUsers);
router.get("/verifications", getVerificationRequests);
router.get("/verifications/:id/document", getVerificationDocument);
router.put("/users/:id/ban", banUser);
router.put("/users/:id/unban", unbanUser);
router.delete("/users/:id", deleteUserByAdmin);
router.get("/products", getAllProducts);
router.put("/products/:id/moderate", moderateProduct);
router.get("/orders", getAllOrders);
router.get("/reports", getReports);
router.put("/reports/:id", resolveReport);

module.exports = router;
