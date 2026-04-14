const express = require("express");
const router = express.Router();

const {
  createProduct,
  getProducts,
  getProductById,
  getMyProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const { protect, isSeller } = require("../middleware/authMiddleware");

// 🌍 Public routes
router.get("/", getProducts);
router.get("/my", protect, isSeller, getMyProducts);
router.get("/:id", getProductById);

// 🏪 Seller routes
router.post("/", protect, isSeller, createProduct);
router.put("/:id", protect, isSeller, updateProduct);

// 🗑 Delete (Seller or Admin)
router.delete("/:id", protect, deleteProduct);

module.exports = router;
