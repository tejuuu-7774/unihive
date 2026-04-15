const fs = require("fs");
const path = require("path");
const multer = require("multer");

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
  if (!file.mimetype.startsWith("image/")) {
    cb(new AppError("Only image uploads are allowed", 400));
    return;
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
