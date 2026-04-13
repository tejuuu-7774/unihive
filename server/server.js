const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const connectDB = require("./config/db");

// Load env vars
dotenv.config();

// Connect DB
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(morgan("dev"));

// Test route
app.get("/", (req, res) => {
  res.send("UniHive API is running...");
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});