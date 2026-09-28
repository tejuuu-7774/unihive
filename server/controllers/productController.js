const Product = require("../models/Product");
const Review = require("../models/Review");
const Order = require("../models/Order");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const { isValidObjectId, isProvided, parseSort } = require("../utils/validation");
const { successResponse } = require("../utils/response");

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

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

  successResponse(res, product, "Product created", 201);
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
    page = 1,
    limit = 10,
  } = req.query;

  const query = { isApproved: true, isArchived: false };

  if (category) query.category = category;
  if (productType) query.productType = productType;
  if (deliveryType) query.deliveryType = deliveryType;

  if (seller && isValidObjectId(seller)) {
    query.seller = seller;
  }

  if (search) {
    const safeSearch = escapeRegex(search.toString().slice(0, 100));
    query.$or = [
      { title: { $regex: safeSearch, $options: "i" } },
      { description: { $regex: safeSearch, $options: "i" } },
      { category: { $regex: safeSearch, $options: "i" } },
    ];
  }

  if (minPrice || maxPrice) {
    query.price = {};
    const minimum = Number(minPrice);
    const maximum = Number(maxPrice);
    if (minPrice && Number.isFinite(minimum)) query.price.$gte = minimum;
    if (maxPrice && Number.isFinite(maximum)) query.price.$lte = maximum;
  }

  const pageNumber = Math.max(1, Number(page) || 1);
  const pageSize = Math.min(50, Math.max(1, Number(limit) || 10));
  const skip = (pageNumber - 1) * pageSize;

  const total = await Product.countDocuments(query);

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
    .skip(skip)
    .limit(pageSize)
    .select("-__v")
    .populate("seller", "name collegeName");

  successResponse(
    res,
    {
      products,
      page: pageNumber,
      pages: Math.ceil(total / pageSize),
      total,
    },
    "Products fetched successfully"
  );
});

exports.getProductById = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    throw new AppError("Invalid product id", 400);
  }

  const product = await Product.findOne({ _id: req.params.id, isApproved: true, isArchived: false })
    .select("-__v")
    .populate("seller", "name collegeName");

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  const reviews = await Review.find({ product: product._id })
    .sort({ createdAt: -1 })
    .populate("user", "name");

  successResponse(
    res,
    { ...product.toObject(), reviews },
    "Product fetched"
  );
});

exports.getMyProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ seller: req.user._id, isArchived: false })
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

  successResponse(res, product, "Product updated");
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

  product.isArchived = true;
  product.isApproved = false;
  product.moderationStatus = "rejected";
  product.moderationNote = "Archived by seller";
  await product.save();

  successResponse(res, null, "Product deleted successfully");
});
