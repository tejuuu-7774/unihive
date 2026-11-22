const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");
const sellerRoutes = require("./routes/sellerRoutes");
const reportRoutes = require("./routes/reportRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const { securityHeaders, authRateLimit } = require("./middleware/securityMiddleware");

dotenv.config();
connectDB();

const app = express();
const normalizeOrigin = (value) => {
  if (!value) return null;
  try {
    return new URL(value).origin;
  } catch {
    const protocol = value.startsWith("localhost") ? "http://" : "https://";
    try {
      return new URL(`${protocol}${value}`).origin;
    } catch {
      return null;
    }
  }
};
const allowedOrigins = [
  "http://localhost:3000",
  normalizeOrigin(process.env.FRONTEND_URL),
].filter(Boolean);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(securityHeaders);
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use((req, res, next) => {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();
  const origin = req.get("origin");
  if (origin && !allowedOrigins.includes(origin)) {
    return res.status(403).json({ success: false, message: "Untrusted request origin" });
  }
  next();
});
app.use(cookieParser());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("UniHive API is running...");
});

app.use("/api/auth", authRateLimit, authRoutes);
if (process.env.NODE_ENV !== "production") {
  app.use("/api/test", testRoutes);
}
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/reports", reportRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
