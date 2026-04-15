const fs = require("fs");
const path = require("path");
const multer = require("multer");
const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
const AppError = require("../utils/AppError");

const uploadDir = path.join(__dirname, "..", "uploads", "student-ids");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname) || ".jpg";
    cb(null, `${req.user._id}-${Date.now()}${extension}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new AppError("Only JPG, PNG, WEBP images are allowed", 400));
  }

  cb(null, true);
};

const uploadStudentIdCard = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = {
  uploadStudentIdCard,
};
