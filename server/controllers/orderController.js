const Order = require("../models/Order");
const Product = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const { isValidObjectId } = require("../utils/validation");
const { successResponse } = require("../utils/response");

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

  const product = await Product.findById(productId).populate("seller");

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
    sellerContact: product.seller.phone,
    chatType,
    paymentType,
  });

  const populatedOrder = await Order.findById(order._id)
    .select("-__v")
    .populate("product", "title price images")
    .populate("seller", "name phone")
    .populate("buyer", "name");

  successResponse(res, populatedOrder, "Order placed successfully", 201);
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

  const validTransitions = {
    requested: ["accepted", "rejected"],
    accepted: ["shipped"],
    shipped: ["delivered"],
  };

  if (
    !validTransitions[order.status] ||
    !validTransitions[order.status].includes(status)
  ) {
    throw new AppError(
      `Invalid status transition from ${order.status} to ${status}`,
      400
    );
  }

  if (status === "accepted") {
    const product = await Product.findById(order.product);

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    if (product.stock < order.quantity) {
      throw new AppError("Not enough stock to accept this order", 400);
    }

    product.stock -= order.quantity;
    await product.save();
  }

  order.status = status;

  if (paymentStatus) {
    order.paymentStatus = paymentStatus;
  }

  await order.save();

  successResponse(res, order, "Order status updated");
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

  order.status = "cancelled";
  await order.save();

  successResponse(res, order, "Order cancelled");
});

exports.getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ buyer: req.user._id })
    .sort({ createdAt: -1 })
    .select("-__v")
    .populate("product", "title price images category")
    .populate("seller", "name phone");

  successResponse(res, orders, "Orders fetched");
});

exports.getSellerOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ seller: req.user._id })
    .sort({ createdAt: -1 })
    .select("-__v")
    .populate("product", "title price images category")
    .populate("buyer", "name email phone");

  successResponse(res, orders, "Seller orders fetched");
});
