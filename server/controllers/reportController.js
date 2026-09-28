const Report = require("../models/Report");
const Product = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const { isValidObjectId } = require("../utils/validation");
const { successResponse } = require("../utils/response");

exports.createReport = asyncHandler(async (req, res) => {
  const { productId, reason, details } = req.body;
  if (!isValidObjectId(productId)) throw new AppError("Invalid product id", 400);
  if (!["prohibited", "misleading", "fraud", "harassment", "other"].includes(reason)) {
    throw new AppError("Please choose a valid report reason", 400);
  }
  const product = await Product.findOne({ _id: productId, isApproved: true });
  if (!product) throw new AppError("Product not found", 404);
  const existing = await Report.findOne({
    reporter: req.user._id,
    product: productId,
    status: "open",
  });
  if (existing) throw new AppError("You already reported this product", 400);
  const report = await Report.create({
    reporter: req.user._id,
    product: productId,
    reason,
    details,
  });
  successResponse(res, report, "Report submitted", 201);
});

exports.getReports = asyncHandler(async (req, res) => {
  const status = req.query.status || "open";
  const query = status === "all" ? {} : { status };
  const reports = await Report.find(query)
    .sort({ createdAt: -1 })
    .populate("reporter", "name email")
    .populate({
      path: "product",
      select: "title seller moderationStatus",
      populate: { path: "seller", select: "name email" },
    })
    .populate("resolvedBy", "name");
  successResponse(res, reports, "Reports fetched");
});

exports.resolveReport = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) throw new AppError("Invalid report id", 400);
  const { status, resolutionNote } = req.body;
  if (!["resolved", "dismissed"].includes(status)) {
    throw new AppError("Status must be resolved or dismissed", 400);
  }
  const report = await Report.findById(req.params.id);
  if (!report) throw new AppError("Report not found", 404);
  report.status = status;
  report.resolutionNote = resolutionNote;
  report.resolvedBy = req.user._id;
  report.resolvedAt = new Date();
  await report.save();
  successResponse(res, report, "Report updated");
});
