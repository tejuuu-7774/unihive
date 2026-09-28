const ORDER_TRANSITIONS = Object.freeze({
  requested: ["accepted", "rejected"],
  accepted: ["shipped"],
  shipped: ["delivered"],
  rejected: [],
  delivered: [],
  cancelled: [],
});

const canTransitionOrder = (from, to) =>
  Boolean(ORDER_TRANSITIONS[from]?.includes(to));

module.exports = { ORDER_TRANSITIONS, canTransitionOrder };
