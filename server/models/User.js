const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      enum: ["user", "seller", "admin"],
      default: "user",
    },

    // 🔐 Student Verification
    isVerified: {
      type: Boolean,
      default: false,
    },

    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    studentIdCard: {
      type: String, // image URL later (Cloudinary) for verification
    },

    collegeName: {
      type: String,
      trim: true,
    },

    // Ban & Safety System
    violations: {
      type: Number,
      default: 0,
    },

    isBanned: {
      type: Boolean,
      default: false,
    },

    banReason: {
      type: String,
      trim: true,
    },

    // Profile
    avatar: {
      type: String,
    },

    bio: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
