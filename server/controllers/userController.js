const User = require("../models/User");

// Request verification (user uploads ID)
exports.requestVerification = async (req, res) => {
  try {
    const { collegeName, studentIdCard } = req.body;

    const user = await User.findById(req.user._id);

    user.collegeName = collegeName;
    user.studentIdCard = studentIdCard;
    user.verificationStatus = "pending";

    await user.save();

    res.json({ message: "Verification request submitted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin approves seller
exports.approveSeller = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.verificationStatus = "approved";
    user.isVerified = true;
    user.role = "seller";

    await user.save();

    res.json({ message: "Seller approved" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin rejects seller
exports.rejectSeller = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    user.verificationStatus = "rejected";

    await user.save();

    res.json({ message: "Seller rejected" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};