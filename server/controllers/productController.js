const Product = require("../models/Product");

// Create Product (Seller Only)
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create({
      ...req.body,
      seller: req.user._id,
      sellerVerified: req.user.isVerified,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Products (Public)
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ createdAt: -1 }) 
      .select("-__v") 
      .populate("seller", "name collegeName");

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};