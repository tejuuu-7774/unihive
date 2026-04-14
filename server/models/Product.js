const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    images: [
      {
        type: String,
      },
    ],

    // 👤 Seller Info
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    sellerVerified: {
      type: Boolean,
      default: true,
    },

    // 📦 Product Type
    productType: {
      type: String,
      enum: ["physical", "digital", "service"],
      required: true,
    },

    // 🚚 Delivery Options
    deliveryType: {
      type: String,
      enum: ["pickup", "shipping", "both"],
      default: "both",
    },

    // 📊 Inventory (optional for now)
    stock: {
      type: Number,
      default: 1,
      min: 0,
    },

    // ⭐ Ratings (future use)
    rating: {
      type: Number,
      default: 0,
    },

    numReviews: {
      type: Number,
      default: 0,
    },

    // Moderation
    isApproved: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
