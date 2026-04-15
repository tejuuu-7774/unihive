const path = require("path");

const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Review = require("../models/Review");
const { isValidObjectId, isProvided } = require("../utils/validation");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const { successResponse } = require("../utils/response");

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

  successResponse(
    res,
    {
      verificationStatus: user.verificationStatus,
      studentIdCard: user.studentIdCard,
    },
    "Verification request submitted"
  );
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

  successResponse(
    res,
    {
      _id: user._id,
      name: user.name,
      role: user.role,
      isVerified: user.isVerified,
      verificationStatus: user.verificationStatus,
    },
    "Seller approved"
  );
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

  successResponse(
    res,
    {
      _id: user._id,
      name: user.name,
      role: user.role,
      isVerified: user.isVerified,
      verificationStatus: user.verificationStatus,
    },
    "Seller rejected"
  );
});

exports.getProfile = asyncHandler(async (req, res) => {
  successResponse(res, req.user, "Profile fetched");
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

  successResponse(res, user, "Profile updated");
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

  successResponse(
    res,
    { deletedProducts: sellerProductIds.length },
    "Account deleted successfully"
  );
});
