const mongoose = require("mongoose");

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const isProvided = (value) => value !== undefined;

const parseSort = (sortBy, allowedSorts, fallback) => {
  if (!sortBy || !allowedSorts[sortBy]) {
    return fallback;
  }

  return allowedSorts[sortBy];
};

module.exports = {
  isValidObjectId,
  isProvided,
  parseSort,
};
