const Product = require("../models/Product");
const { isValidObjectId, isProvided } = require("../utils/validation");

// 🏪 Create Product (Seller Only)
exports.createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      category,
      productType,
      deliveryType,
      stock,
      images,
    } = req.body;

    if (!title || !description || !category || !productType) {
      return res.status(400).json({
        message: "Title, description, category, and product type are required",
      });
    }

    if (price === undefined || Number(price) < 0) {
      return res.status(400).json({
        message: "Price is required and must be 0 or greater",
      });
    }

    const product = await Product.create({
      title,
      description,
      price,
      category,
      productType,
      deliveryType,
      stock,
      images,
      seller: req.user._id,
      sellerVerified: req.user.isVerified,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🌍 Get All Products (Public)
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({ isApproved: true })
      .sort({ createdAt: -1 })
      .select("-__v")
      .populate("seller", "name collegeName");

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔍 Get Single Product
exports.getProductById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const product = await Product.findById(req.params.id)
      .select("-__v")
      .populate("seller", "name collegeName phone");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id })
      .sort({ createdAt: -1 })
      .select("-__v");

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✏️ Update Product (Seller Only)
exports.updateProduct = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Only seller can update
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Update fields safely
    if (isProvided(req.body.title)) {
      product.title = req.body.title;
    }

    if (isProvided(req.body.description)) {
      product.description = req.body.description;
    }

    if (isProvided(req.body.price)) {
      if (Number(req.body.price) < 0) {
        return res.status(400).json({
          message: "Price must be 0 or greater",
        });
      }
      product.price = req.body.price;
    }

    if (isProvided(req.body.category)) {
      product.category = req.body.category;
    }

    if (isProvided(req.body.productType)) {
      product.productType = req.body.productType;
    }

    if (isProvided(req.body.deliveryType)) {
      product.deliveryType = req.body.deliveryType;
    }

    if (isProvided(req.body.stock)) {
      if (Number(req.body.stock) < 0) {
        return res.status(400).json({
          message: "Stock must be 0 or greater",
        });
      }
      product.stock = req.body.stock;
    }

    if (isProvided(req.body.images)) {
      product.images = req.body.images;
    }

    await product.save();

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🗑 Delete Product (Seller or Admin)
exports.deleteProduct = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (
      product.seller.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await require("../models/Order").deleteMany({ product: product._id });
    await product.deleteOne();

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
