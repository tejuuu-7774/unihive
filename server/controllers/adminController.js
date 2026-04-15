const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Review = require("../models/Review");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const { isValidObjectId, isProvided } = require("../utils/validation");

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  isVerified: user.isVerified,
  verificationStatus: user.verificationStatus,
  collegeName: user.collegeName,
  violations: user.violations,
  isBanned: user.isBanned,
  banReason: user.banReason,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json(users);
});

exports.getVerificationRequests = asyncHandler(async (req, res) => {
  const status = req.query.status || "pending";
  const query = status === "all" ? {} : { verificationStatus: status };

  const users = await User.find(query)
    .select("-password")
    .sort({ createdAt: -1 });

  res.json(users);
});

exports.banUser = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    throw new AppError("Invalid user id", 400);
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.role === "admin") {
    throw new AppError("Admin user cannot be banned", 400);
  }

  user.isBanned = true;

  if (isProvided(req.body.reason)) {
    user.banReason = req.body.reason;
  }

  if (isProvided(req.body.violations)) {
    user.violations = req.body.violations;
  } else {
    user.violations += 1;
  }

  await user.save();

  res.json({
    message: "User banned successfully",
    user: sanitizeUser(user),
  });
});

exports.unbanUser = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    throw new AppError("Invalid user id", 400);
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  user.isBanned = false;
  user.banReason = undefined;

  await user.save();

  res.json({
    message: "User unbanned successfully",
    user: sanitizeUser(user),
  });
});

exports.getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find()
    .sort({ createdAt: -1 })
    .select("-__v")
    .populate("seller", "name email phone role isVerified");

  res.json(products);
});

exports.moderateProduct = asyncHandler(async (req, res) => {
  const { status, note } = req.body;

  if (!isValidObjectId(req.params.id)) {
    throw new AppError("Invalid product id", 400);
  }

  if (!["approved", "rejected"].includes(status)) {
    throw new AppError("Status must be approved or rejected", 400);
  }

  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  product.isApproved = status === "approved";
  product.moderationStatus = status;
  product.moderationNote = note;
  await product.save();

  res.json({
    message: `Product ${status} successfully`,
    product,
  });
});

exports.getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .sort({ createdAt: -1 })
    .select("-__v")
    .populate("product", "title price category")
    .populate("seller", "name email phone")
    .populate("buyer", "name email phone");

  res.json(orders);
});

exports.deleteUserByAdmin = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    throw new AppError("Invalid user id", 400);
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.role === "admin") {
    throw new AppError("Admin user cannot be deleted", 400);
  }

  const sellerProducts = await Product.find({ seller: user._id }).select("_id");
  const sellerProductIds = sellerProducts.map((product) => product._id);

  await Order.deleteMany({
    $or: [
      { buyer: user._id },
      { seller: user._id },
      { product: { $in: sellerProductIds } },
    ],
  });

  await Review.deleteMany({
    $or: [{ user: user._id }, { product: { $in: sellerProductIds } }],
  });
  await Product.deleteMany({ seller: user._id });
  await user.deleteOne();

  res.json({ message: "User deleted successfully" });
});
