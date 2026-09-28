const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Review = require("../models/Review");
const path = require("path");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const { isValidObjectId, isProvided } = require("../utils/validation");
const { successResponse } = require("../utils/response");

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
  const users = await User.find({ isDeleted: false }).select("-password").sort({ createdAt: -1 });
  successResponse(res, users, "Users fetched");
});

exports.getVerificationRequests = asyncHandler(async (req, res) => {
  const status = req.query.status || "pending";
  const query = status === "all" ? {} : { verificationStatus: status };

  const users = await User.find(query)
    .select("-password")
    .sort({ createdAt: -1 });

  successResponse(res, users, "Verification requests fetched");
});

exports.getVerificationDocument = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) throw new AppError("Invalid user id", 400);
  const user = await User.findById(req.params.id).select("studentIdCard");
  if (!user?.studentIdCard?.startsWith("/uploads/student-ids/")) {
    throw new AppError("Verification document not found", 404);
  }
  const filename = path.basename(user.studentIdCard);
  res.sendFile(path.join(__dirname, "..", "uploads", "student-ids", filename));
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

  successResponse(res, sanitizeUser(user), "User banned successfully"); 
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

  successResponse(res, sanitizeUser(user), "User unbanned successfully");
});

exports.getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isArchived: false })
    .sort({ createdAt: -1 })
    .select("-__v")
    .populate("seller", "name email phone role isVerified");

  successResponse(res, products, "All products fetched");
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

  successResponse(res, product, `Product ${status} successfully`);
});

exports.getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .sort({ createdAt: -1 })
    .select("-__v")
    .populate("product", "title price category")
    .populate("seller", "name email phone")
    .populate("buyer", "name email phone");

  successResponse(res, orders, "All orders fetched");
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

  await Product.updateMany({ seller: user._id }, { isArchived: true, isApproved: false });
  user.name = "Deleted user";
  user.email = `deleted-${user._id}@unihive.invalid`;
  user.phone = "0000000000";
  user.whatsappNumber = undefined;
  user.studentIdCard = undefined;
  user.avatar = undefined;
  user.bio = undefined;
  user.isDeleted = true;
  user.deletedAt = new Date();
  user.isBanned = true;
  await user.save();

  successResponse(res, null, "User deleted successfully");
});
