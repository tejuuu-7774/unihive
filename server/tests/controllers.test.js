const test = require("node:test");
const assert = require("node:assert/strict");

const { isValidObjectId, isProvided, parseSort } = require("../utils/validation");
const { authorizeRoles, isSeller } = require("../middleware/authMiddleware");
const { canTransitionOrder } = require("../utils/orderTransitions");
const { normalizeIndianPhone } = require("../utils/phone");

test("validation helpers work for ids and provided values", () => {
  assert.equal(isValidObjectId("507f1f77bcf86cd799439011"), true);
  assert.equal(isValidObjectId("bad-id"), false);
  assert.equal(isProvided(undefined), false);
  assert.equal(isProvided(null), true);
  assert.equal(isProvided(0), true);
});

test("parseSort returns fallback for invalid sort keys", () => {
  assert.deepEqual(
    parseSort("invalid", { newest: { createdAt: -1 } }, { createdAt: -1 }),
    { createdAt: -1 }
  );
});

test("authorizeRoles allows matching role", () => {
  const middleware = authorizeRoles("admin");
  let nextCalled = false;
  const req = { user: { role: "admin" } };
  const res = {
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.payload = payload;
      return this;
    },
  };

  middleware(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
});

test("isSeller blocks non-seller users", () => {
  let nextCalled = false;
  const req = { user: { role: "user", isVerified: false } };
  const res = {
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.payload = payload;
      return this;
    },
  };

  isSeller(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, false);
  assert.equal(res.statusCode, 403);
  assert.equal(
    res.payload.message,
    "Only verified sellers can perform this action"
  );
});

test("order transitions enforce the marketplace lifecycle", () => {
  assert.equal(canTransitionOrder("requested", "accepted"), true);
  assert.equal(canTransitionOrder("requested", "shipped"), false);
  assert.equal(canTransitionOrder("accepted", "shipped"), true);
  assert.equal(canTransitionOrder("delivered", "accepted"), false);
});

test("Indian mobile numbers are accepted in familiar formats and normalized", () => {
  assert.equal(normalizeIndianPhone("9876543210"), "919876543210");
  assert.equal(normalizeIndianPhone("+91 98765 43210"), "919876543210");
  assert.equal(normalizeIndianPhone("09876543210"), "919876543210");
});

test("invalid Indian mobile numbers are rejected", () => {
  assert.equal(normalizeIndianPhone("1234567890"), null);
  assert.equal(normalizeIndianPhone("98765"), null);
  assert.equal(normalizeIndianPhone("91987654321099"), null);
  assert.equal(normalizeIndianPhone("not-a-number"), null);
});
