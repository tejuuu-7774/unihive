export function displayIndianPhone(value?: string) {
  if (!value) return "";
  const digits = value.replace(/\D/g, "");
  return /^91[6-9]\d{9}$/.test(digits) ? digits.slice(2) : value;
}
