const express = require("express");

const {
  getProductReviews,
  createOrUpdateReview,
  deleteReview,
} = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router({ mergeParams: true });

router.get("/", getProductReviews);
router.post("/", protect, createOrUpdateReview);
router.delete("/:reviewId", protect, deleteReview);

module.exports = router;
