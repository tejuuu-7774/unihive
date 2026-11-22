const INDIAN_MOBILE_ERROR =
  "Enter a valid 10-digit Indian mobile number, for example 9876543210";

const normalizeIndianPhone = (value) => {
  const raw = String(value ?? "").trim();
  const digits = raw.replace(/[\s()-]/g, "").replace(/^\+/, "");

  if (/^[6-9]\d{9}$/.test(digits)) return `91${digits}`;
  if (/^0[6-9]\d{9}$/.test(digits)) return `91${digits.slice(1)}`;
  if (/^91[6-9]\d{9}$/.test(digits)) return digits;

  return null;
};

module.exports = { INDIAN_MOBILE_ERROR, normalizeIndianPhone };
