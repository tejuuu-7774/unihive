const Order = require("../models/Order");
const Product = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const { isValidObjectId } = require("../utils/validation");
const { successResponse } = require("../utils/response");
const { canTransitionOrder } = require("../utils/orderTransitions");

exports.createOrder = asyncHandler(async (req, res) => {
  const {
    productId,
    quantity = 1,
    chatType = "whatsapp",
    paymentType = "direct",
  } = req.body;

  if (!isValidObjectId(productId)) {
    throw new AppError("Invalid product id", 400);
  }

  if (!Number.isInteger(Number(quantity)) || Number(quantity) < 1) {
    throw new AppError("Quantity must be a whole number greater than 0", 400);
  }

  const product = await Product.findById(productId).populate("seller", "name phone whatsappNumber");

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  if (!product.isApproved) {
    throw new AppError("Product is not available", 400);
  }

  if (product.seller._id.toString() === req.user._id.toString()) {
    throw new AppError("You cannot buy your own product", 400);
  }

  if (product.stock < Number(quantity)) {
    throw new AppError("Insufficient stock", 400);
  }

  const existingActiveOrder = await Order.findOne({
    buyer: req.user._id,
    product: product._id,
    status: { $in: ["requested", "accepted", "shipped"] },
  });

  if (existingActiveOrder) {
    throw new AppError("You already have an active order for this product", 400);
  }

  const order = await Order.create({
    buyer: req.user._id,
    seller: product.seller._id,
    product: product._id,
    quantity: Number(quantity),
    totalPrice: product.price * Number(quantity),
    sellerContact: product.seller.whatsappNumber || product.seller.phone,
    chatType,
    paymentType,
    statusHistory: [
      { status: "requested", changedBy: req.user._id, changedAt: new Date() },
    ],
  });

  const populatedOrder = await Order.findById(order._id)
    .select("-__v")
    .populate("product", "title price images")
    .populate("seller", "name phone")
    .populate("buyer", "name");

  const safeOrder = populatedOrder.toObject();
  delete safeOrder.sellerContact;
  if (safeOrder.seller) delete safeOrder.seller.phone;
  successResponse(res, safeOrder, "Order placed successfully", 201);
});

exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, paymentStatus } = req.body;

  if (!isValidObjectId(req.params.id)) {
    throw new AppError("Invalid order id", 400);
  }

  if (!status) {
    throw new AppError("Status is required", 400);
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  if (
    order.seller.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new AppError("Not authorized", 403);
  }

  if (!canTransitionOrder(order.status, status)) {
    throw new AppError(
      `Invalid status transition from ${order.status} to ${status}`,
      400
    );
  }

  const update = {
    $set: { status, ...(paymentStatus ? { paymentStatus } : {}) },
    $push: {
      statusHistory: { status, changedBy: req.user._id, changedAt: new Date() },
    },
  };
  const transitionedOrder = await Order.findOneAndUpdate(
    { _id: order._id, status: order.status },
    update,
    { new: true, runValidators: true }
  );
  if (!transitionedOrder) {
    throw new AppError("Order status changed. Refresh and try again", 409);
  }

  if (status === "accepted") {
    const product = await Product.findOneAndUpdate(
      { _id: order.product, stock: { $gte: order.quantity }, isApproved: true },
      { $inc: { stock: -order.quantity } },
      { new: true }
    );
    if (!product) {
      await Order.updateOne(
        { _id: order._id, status: "accepted" },
        { $set: { status: "requested" }, $pop: { statusHistory: 1 } }
      );
      throw new AppError("Not enough stock to accept this order", 400);
    }
  }
  successResponse(res, transitionedOrder, "Order status updated");
});

exports.cancelOrder = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    throw new AppError("Invalid order id", 400);
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  if (order.buyer.toString() !== req.user._id.toString()) {
    throw new AppError("Not authorized", 403);
  }

  if (order.status !== "requested") {
    throw new AppError("Cannot cancel after seller accepted", 400);
  }

  const cancelledOrder = await Order.findOneAndUpdate(
    { _id: order._id, buyer: req.user._id, status: "requested" },
    {
      $set: { status: "cancelled" },
      $push: { statusHistory: { status: "cancelled", changedBy: req.user._id, changedAt: new Date() } },
    },
    { new: true, runValidators: true }
  );
  if (!cancelledOrder) throw new AppError("Order can no longer be cancelled", 409);
  successResponse(res, cancelledOrder, "Order cancelled");
});

exports.getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ buyer: req.user._id })
    .sort({ createdAt: -1 })
    .select("-__v")
    .populate("product", "title price images category")
    .populate("seller", "name phone");

  const safeOrders = orders.map((order) => {
    const value = order.toObject();
    if (!["accepted", "shipped", "delivered"].includes(value.status)) {
      delete value.sellerContact;
      if (value.seller) delete value.seller.phone;
    }
    return value;
  });
  successResponse(res, safeOrders, "Orders fetched");
});

exports.getSellerOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ seller: req.user._id })
    .sort({ createdAt: -1 })
    .select("-__v")
    .populate("product", "title price images category")
    .populate("buyer", "name email phone");

  successResponse(res, orders, "Seller orders fetched");
});
