const Product = require("../models/Product");
const Review = require("../models/Review");
const Order = require("../models/Order");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const { isValidObjectId } = require("../utils/validation");

const syncProductRatings = async (productId) => {
  const reviews = await Review.find({ product: productId });
  const numReviews = reviews.length;
  const rating =
    numReviews === 0
      ? 0
      : reviews.reduce((sum, review) => sum + review.rating, 0) / numReviews;

  await Product.findByIdAndUpdate(productId, {
    rating: Number(rating.toFixed(1)),
    numReviews,
  });
};

exports.getProductReviews = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.productId)) {
    throw new AppError("Invalid product id", 400);
  }

  const reviews = await Review.find({ product: req.params.productId })
    .sort({ createdAt: -1 })
    .populate("user", "name");

  res.json(reviews);
});

exports.createOrUpdateReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const { productId } = req.params;

  if (!isValidObjectId(productId)) {
    throw new AppError("Invalid product id", 400);
  }

  if (!rating || Number(rating) < 1 || Number(rating) > 5) {
    throw new AppError("Rating must be between 1 and 5", 400);
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  const deliveredOrder = await Order.findOne({
    product: productId,
    buyer: req.user._id,
    status: "delivered",
  });

  if (!deliveredOrder) {
    throw new AppError("You can review only delivered purchases", 403);
  }

  const review = await Review.findOneAndUpdate(
    { product: productId, user: req.user._id },
    {
      rating: Number(rating),
      comment,
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
      runValidators: true,
    }
  );

  await syncProductRatings(productId);

  res.status(201).json(review);
});

exports.deleteReview = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.reviewId)) {
    throw new AppError("Invalid review id", 400);
  }

  const review = await Review.findById(req.params.reviewId);

  if (!review) {
    throw new AppError("Review not found", 404);
  }

  if (
    review.user.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new AppError("Not authorized to delete this review", 403);
  }

  const productId = review.product;
  await review.deleteOne();
  await syncProductRatings(productId);

  res.json({ message: "Review deleted successfully" });
});
