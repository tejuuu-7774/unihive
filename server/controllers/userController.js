const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const { isValidObjectId, isProvided } = require("../utils/validation");

// 🔐 Request verification (user uploads ID)
exports.requestVerification = async (req, res) => {
  try {
    const { collegeName, studentIdCard } = req.body;

    if (!collegeName || !studentIdCard) {
      return res.status(400).json({
        message: "College name and student ID card are required",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.collegeName = collegeName || user.collegeName;
    user.studentIdCard = studentIdCard || user.studentIdCard;
    user.verificationStatus = "pending";
    user.isVerified = false;

    if (user.role !== "admin") {
      user.role = "user";
    }

    await user.save();

    res.json({
      message: "Verification request submitted",
      verificationStatus: user.verificationStatus,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🛠 Admin approves seller
exports.approveSeller = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
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
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ❌ Admin rejects seller
exports.rejectSeller = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
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
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 👤 Get Profile
exports.getProfile = async (req, res) => {
  res.json(req.user);
};

// ✏️ Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
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
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🗑 Delete Account
exports.deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
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

    await Product.deleteMany({ seller: user._id });
    await user.deleteOne();

    res.json({
      message: "Account deleted successfully",
      deletedProducts: sellerProductIds.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
