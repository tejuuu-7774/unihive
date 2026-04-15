const path = require("path");

const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Review = require("../models/Review");
const { isValidObjectId, isProvided } = require("../utils/validation");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

exports.requestVerification = asyncHandler(async (req, res) => {
  const { collegeName, studentIdCard } = req.body;
  const uploadedCardPath = req.file
    ? `/uploads/student-ids/${path.basename(req.file.path)}`
    : undefined;

  if (!collegeName || (!studentIdCard && !uploadedCardPath)) {
    throw new AppError(
      "College name and student ID card are required",
      400
    );
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  user.collegeName = collegeName;
  user.studentIdCard = uploadedCardPath || studentIdCard;
  user.verificationStatus = "pending";
  user.isVerified = false;

  if (user.role !== "admin") {
    user.role = "user";
  }

  await user.save();

  res.json({
    message: "Verification request submitted",
    verificationStatus: user.verificationStatus,
    studentIdCard: user.studentIdCard,
  });
});

exports.approveSeller = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    throw new AppError("Invalid user id", 400);
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  user.verificationStatus = "approved";
  user.isVerified = true;
  user.role = "seller";

  await user.save();

  res.json({
    message: "Seller approved",
    user: {
      _id: user._id,
      name: user.name,
      role: user.role,
      isVerified: user.isVerified,
      verificationStatus: user.verificationStatus,
    },
  });
});

exports.rejectSeller = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    throw new AppError("Invalid user id", 400);
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  user.verificationStatus = "rejected";
  user.isVerified = false;
  user.role = "user";

  await user.save();

  res.json({
    message: "Seller rejected",
    user: {
      _id: user._id,
      name: user.name,
      role: user.role,
      isVerified: user.isVerified,
      verificationStatus: user.verificationStatus,
    },
  });
});

exports.getProfile = asyncHandler(async (req, res) => {
  res.json(req.user);
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (isProvided(req.body.name)) {
    user.name = req.body.name;
  }

  if (isProvided(req.body.phone)) {
    user.phone = req.body.phone;
  }

  if (isProvided(req.body.bio)) {
    user.bio = req.body.bio;
  }

  if (isProvided(req.body.avatar)) {
    user.avatar = req.body.avatar;
  }

  await user.save();

  res.json(user);
});

exports.deleteAccount = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new AppError("User not found", 404);
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

  res.json({
    message: "Account deleted successfully",
    deletedProducts: sellerProductIds.length,
  });
});
