const mongoose = require("mongoose");
const userSchema = require("../models/user").schema;
const leaveDetailsSchema = require("../models/leaveDetails").schema;
const leaveSchema = require("../models/leave").schema;

const userModel = mongoose.model("users", userSchema, "users");
const leaveDetailsModel = mongoose.model(
  "leave.details",
  leaveDetailsSchema,
  "leave.details"
);
const leaveModel = mongoose.model("leaves", leaveSchema, "leaves");

module.exports = {
  userModel: userModel,
  leaveDetailsModel: leaveDetailsModel,
  leaveModel: leaveModel,
};
