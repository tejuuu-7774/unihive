const Order = require("../models/Order");
const Product = require("../models/Product");
const { isValidObjectId } = require("../utils/validation");

// 📦 Place Order Request
exports.createOrder = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!isValidObjectId(productId)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    if (!Number.isInteger(Number(quantity)) || Number(quantity) < 1) {
      return res.status(400).json({
        message: "Quantity must be a whole number greater than 0",
      });
    }

    const product = await Product.findById(productId).populate("seller");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (!product.isApproved) {
      return res.status(400).json({ message: "Product is not available" });
    }

    // ❌ Prevent self-buy
    if (product.seller._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        message: "You cannot buy your own product",
      });
    }

    // ❌ Optional: stock check
    if (product.stock < quantity) {
      return res.status(400).json({
        message: "Insufficient stock",
      });
    }

    const existingActiveOrder = await Order.findOne({
      buyer: req.user._id,
      product: product._id,
      status: { $in: ["requested", "accepted", "shipped"] },
    });

    if (existingActiveOrder) {
      return res.status(400).json({
        message: "You already have an active order for this product",
      });
    }

    const order = await Order.create({
      buyer: req.user._id,
      seller: product.seller._id,
      product: product._id,
      quantity: Number(quantity),
      totalPrice: product.price * quantity,
      sellerContact: product.seller.phone,
    });

    const populatedOrder = await Order.findById(order._id)
      .select("-__v")
      .populate("product", "title price images")
      .populate("seller", "name phone")
      .populate("buyer", "name");

    res.status(201).json(populatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🏪 Seller updates order status (STRICT FLOW)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid order id" });
    }

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Only seller
    if (
      order.seller.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // 🔒 Allowed transitions
    const validTransitions = {
      requested: ["accepted", "rejected"],
      accepted: ["shipped"],
      shipped: ["delivered"],
    };

    const currentStatus = order.status;

    if (
      !validTransitions[currentStatus] ||
      !validTransitions[currentStatus].includes(status)
    ) {
      return res.status(400).json({
        message: `Invalid status transition from ${currentStatus} to ${status}`,
      });
    }

    order.status = status;

    if (status === "accepted") {
      const product = await Product.findById(order.product);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (product.stock < order.quantity) {
        return res.status(400).json({
          message: "Not enough stock to accept this order",
        });
      }

      product.stock -= order.quantity;
      await product.save();
    }

    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 👤 Buyer cancels order (ONLY before accept)
exports.cancelOrder = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid order id" });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (order.status !== "requested") {
      return res.status(400).json({
        message: "Cannot cancel after seller accepted",
      });
    }

    order.status = "cancelled";

    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📜 Buyer orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id })
      .sort({ createdAt: -1 })
      .select("-__v")
      .populate("product", "title price images category")
      .populate("seller", "name phone");

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🏪 Seller orders (IMPORTANT ADDITION)
exports.getSellerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ seller: req.user._id })
      .sort({ createdAt: -1 })
      .select("-__v")
      .populate("product", "title price images category")
      .populate("buyer", "name email phone");

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
