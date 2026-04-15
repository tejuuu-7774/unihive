const Product = require("../models/Product");
const Order = require("../models/Order");
const asyncHandler = require("../utils/asyncHandler");

exports.getSellerAnalytics = asyncHandler(async (req, res) => {
  const [products, orders] = await Promise.all([
    Product.find({ seller: req.user._id }).select("_id isApproved"),
    Order.find({ seller: req.user._id }).select("status totalPrice quantity"),
  ]);

  res.json({
    totalProducts: products.length,
    approvedProducts: products.filter((product) => product.isApproved).length,
    pendingProducts: products.filter((product) => !product.isApproved).length,
    totalOrders: orders.length,
    requestedOrders: orders.filter((order) => order.status === "requested")
      .length,
    acceptedOrders: orders.filter((order) => order.status === "accepted").length,
    rejectedOrders: orders.filter((order) => order.status === "rejected").length,
    shippedOrders: orders.filter((order) => order.status === "shipped").length,
    deliveredOrders: orders.filter((order) => order.status === "delivered")
      .length,
    cancelledOrders: orders.filter((order) => order.status === "cancelled")
      .length,
    totalUnitsSold: orders
      .filter((order) => ["accepted", "shipped", "delivered"].includes(order.status))
      .reduce((sum, order) => sum + order.quantity, 0),
    grossRevenue: orders
      .filter((order) => ["accepted", "shipped", "delivered"].includes(order.status))
      .reduce((sum, order) => sum + order.totalPrice, 0),
  });
});
