const mongoose = require("mongoose");

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const isProvided = (value) => value !== undefined;

module.exports = {
  isValidObjectId,
  isProvided,
};
