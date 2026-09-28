const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    reason: {
      type: String,
      enum: ["prohibited", "misleading", "fraud", "harassment", "other"],
      required: true,
    },
    details: { type: String, trim: true, maxlength: 1000 },
    status: {
      type: String,
      enum: ["open", "resolved", "dismissed"],
      default: "open",
    },
    resolutionNote: { type: String, trim: true, maxlength: 1000 },
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    resolvedAt: Date,
  },
  { timestamps: true }
);

reportSchema.index({ status: 1, createdAt: -1 });
reportSchema.index({ reporter: 1, product: 1, status: 1 });

module.exports = mongoose.model("Report", reportSchema);
