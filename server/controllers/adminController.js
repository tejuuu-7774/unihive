const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const { isValidObjectId, isProvided } = require("../utils/validation");

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

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getVerificationRequests = async (req, res) => {
  try {
    const status = req.query.status || "pending";
    const query = status === "all" ? {} : { verificationStatus: status };

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.banUser = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(400).json({ message: "Admin user cannot be banned" });
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

    res.json({
      message: "User banned successfully",
      user: sanitizeUser(user),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.unbanUser = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isBanned = false;
    user.banReason = undefined;

    await user.save();

    res.json({
      message: "User unbanned successfully",
      user: sanitizeUser(user),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .select("-__v")
      .populate("seller", "name email phone role isVerified");

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .select("-__v")
      .populate("product", "title price category")
      .populate("seller", "name email phone")
      .populate("buyer", "name email phone");

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUserByAdmin = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(400).json({ message: "Admin user cannot be deleted" });
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

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
