const Product = require("../models/Product");
const Review = require("../models/Review");
const Order = require("../models/Order");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const { isValidObjectId, isProvided, parseSort } = require("../utils/validation");

exports.createProduct = asyncHandler(async (req, res) => {
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
    throw new AppError(
      "Title, description, category, and product type are required",
      400
    );
  }

  if (price === undefined || Number(price) < 0) {
    throw new AppError("Price is required and must be 0 or greater", 400);
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
    isApproved: false,
    moderationStatus: "pending",
  });

  res.status(201).json(product);
});

exports.getProducts = asyncHandler(async (req, res) => {
  const {
    category,
    productType,
    deliveryType,
    search,
    minPrice,
    maxPrice,
    seller,
    sortBy,
  } = req.query;

  const query = { isApproved: true };

  if (category) {
    query.category = category;
  }

  if (productType) {
    query.productType = productType;
  }

  if (deliveryType) {
    query.deliveryType = deliveryType;
  }

  if (seller && isValidObjectId(seller)) {
    query.seller = seller;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
    ];
  }

  if (minPrice || maxPrice) {
    query.price = {};

    if (minPrice) {
      query.price.$gte = Number(minPrice);
    }

    if (maxPrice) {
      query.price.$lte = Number(maxPrice);
    }
  }

  const products = await Product.find(query)
    .sort(
      parseSort(
        sortBy,
        {
          newest: { createdAt: -1 },
          oldest: { createdAt: 1 },
          priceAsc: { price: 1 },
          priceDesc: { price: -1 },
          ratingDesc: { rating: -1 },
        },
        { createdAt: -1 }
      )
    )
    .select("-__v")
    .populate("seller", "name collegeName");

  res.json(products);
});

exports.getProductById = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    throw new AppError("Invalid product id", 400);
  }

  const product = await Product.findById(req.params.id)
    .select("-__v")
    .populate("seller", "name collegeName phone");

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  const reviews = await Review.find({ product: product._id })
    .sort({ createdAt: -1 })
    .populate("user", "name");

  res.json({
    ...product.toObject(),
    reviews,
  });
});

exports.getMyProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ seller: req.user._id })
    .sort({ createdAt: -1 })
    .select("-__v");

  res.json(products);
});

exports.updateProduct = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    throw new AppError("Invalid product id", 400);
  }

  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  if (product.seller.toString() !== req.user._id.toString()) {
    throw new AppError("Not authorized", 403);
  }

  if (isProvided(req.body.title)) {
    product.title = req.body.title;
  }

  if (isProvided(req.body.description)) {
    product.description = req.body.description;
  }

  if (isProvided(req.body.price)) {
    if (Number(req.body.price) < 0) {
      throw new AppError("Price must be 0 or greater", 400);
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
      throw new AppError("Stock must be 0 or greater", 400);
    }

    product.stock = req.body.stock;
  }

  if (isProvided(req.body.images)) {
    product.images = req.body.images;
  }

  product.isApproved = false;
  product.moderationStatus = "pending";
  product.moderationNote = undefined;

  await product.save();

  res.json(product);
});

exports.deleteProduct = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    throw new AppError("Invalid product id", 400);
  }

  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  if (
    product.seller.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new AppError("Not authorized", 403);
  }

  await Order.deleteMany({ product: product._id });
  await Review.deleteMany({ product: product._id });
  await product.deleteOne();

  res.json({ message: "Product deleted successfully" });
});
