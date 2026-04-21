const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const asyncHandler = require("../utils/asyncHandler");
const { successResponse } = require("../utils/response");
const AppError = require("../utils/AppError");


const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

const setAuthCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

exports.registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password || !phone) {
    throw new AppError("Name, email, password, and phone are required", 400);
  }

  if (!EMAIL_REGEX.test(email)) {
    throw new AppError("Please provide a valid email", 400);
  }

  if (password.length < 6) {
    throw new AppError("Password must be at least 6 characters long", 400);
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new AppError("User already exists", 400);
  }

  const user = await User.create({
    name,
    email,
    password: await bcrypt.hash(password, 10),
    phone,
  });
  const token = generateToken(user._id);

  setAuthCookie(res, token);

  successResponse(
    res,
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isVerified: user.isVerified,
      verificationStatus: user.verificationStatus,
    },
    "User registered successfully",
    201
  );
});

exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError("Invalid credentials", 401);
  }

  if (user.isBanned) {
    throw new AppError("User is banned", 403);
  }
  const token = generateToken(user._id);

  setAuthCookie(res, token);

  successResponse(
    res,
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isVerified: user.isVerified,
      verificationStatus: user.verificationStatus,
    },
    "Login successful"
  );
});

exports.logoutUser = asyncHandler(async (_req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    expires: new Date(0),
  });

  successResponse(res, null, "Logout successful");
});
