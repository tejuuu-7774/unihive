const express = require("express");
const router = express.Router();

const { createProduct, getProducts } = require("../controllers/productController");

const { protect, isSeller } = require("../middleware/authMiddleware");

// Public
router.get("/", getProducts);

// Seller only
router.post("/", protect, isSeller, createProduct);

module.exports = router;