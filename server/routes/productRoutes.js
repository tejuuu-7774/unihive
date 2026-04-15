const express = require("express");

const {
  createProduct,
  getProducts,
  getProductById,
  getMyProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { protect, isSeller } = require("../middleware/authMiddleware");
const reviewRoutes = require("./reviewRoutes");

const router = express.Router();

router.get("/", getProducts);
router.get("/my", protect, isSeller, getMyProducts);
router.get("/:id", getProductById);

router.post("/", protect, isSeller, createProduct);
router.put("/:id", protect, isSeller, updateProduct);
router.delete("/:id", protect, deleteProduct);

router.use("/:productId/reviews", reviewRoutes);

module.exports = router;
