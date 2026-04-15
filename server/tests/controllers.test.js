const test = require("node:test");
const assert = require("node:assert/strict");

const { isValidObjectId, isProvided, parseSort } = require("../utils/validation");
const { authorizeRoles, isSeller } = require("../middleware/authMiddleware");

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
