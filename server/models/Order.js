const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // 👤 Buyer
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 🏪 Seller
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 📦 Product
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    // 📊 Order Status
    status: {
      type: String,
      enum: [
        "requested",
        "accepted",
        "rejected",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "requested",
    },

    // 💬 Communication Type
    chatType: {
      type: String,
      enum: ["whatsapp", "in-app"],
      default: "whatsapp",
    },

    // 💸 Payment Type (future-proof)
    paymentType: {
      type: String,
      enum: ["direct", "platform"],
      default: "direct",
    },

    sellerContact: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
