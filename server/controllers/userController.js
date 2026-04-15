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

  // Name
  if (isProvided(req.body.name)) {
    user.name = req.body.name.trim();
  }

  // Phone
  if (isProvided(req.body.phone)) {
    const phone = req.body.phone.toString().trim();

    if (!/^\d{10,15}$/.test(phone)) {
      throw new AppError(
        "Phone number must be digits only (10–15 digits, include country code)",
        400
      );
    }

    user.phone = phone;
  }

  // WhatsApp Number (optional override)
  if (isProvided(req.body.whatsappNumber)) {
    const whatsapp = req.body.whatsappNumber.toString().trim();

    if (!/^\d{10,15}$/.test(whatsapp)) {
      throw new AppError(
        "WhatsApp number must be digits only (10–15 digits, include country code)",
        400
      );
    }

    user.whatsappNumber = whatsapp;
  }

  // Bio
  if (isProvided(req.body.bio)) {
    user.bio = req.body.bio.trim();
  }

  // Avatar
  if (isProvided(req.body.avatar)) {
    user.avatar = req.body.avatar;
  }

  await user.save();

  const sanitizedUser = {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    whatsappNumber: user.whatsappNumber,
    bio: user.bio,
    avatar: user.avatar,
    role: user.role,
    isVerified: user.isVerified,
    verificationStatus: user.verificationStatus,
  };

  successResponse(res, sanitizedUser, "Profile updated");
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
