const WINDOW_MS = 15 * 60 * 1000;
const MAX_AUTH_ATTEMPTS = 30;
const attempts = new Map();

const securityHeaders = (_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  next();
};

const authRateLimit = (req, res, next) => {
  const now = Date.now();
  const record = attempts.get(req.ip);
  if (!record || record.resetAt <= now) {
    attempts.set(req.ip, { count: 1, resetAt: now + WINDOW_MS });
    return next();
  }
  record.count += 1;
  if (record.count > MAX_AUTH_ATTEMPTS) {
    return res.status(429).json({
      success: false,
      message: "Too many attempts. Try again later.",
    });
  }
  next();
};

module.exports = { securityHeaders, authRateLimit };
