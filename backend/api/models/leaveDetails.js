const mongoose = require(`mongoose`);

const schema = new mongoose.Schema({
  userInfo: { type: Object, required: false },
  typeOfLeave: { type: String, required: true },
  dateFrom: { type: Date, required: true },
  dateTo: { type: Date, required: true },
  ttlLeaves: { type: Number },
  attachment: { type: Object, required: false },
  description: { type: String, required: true },
  coOrdinatorHandledBy: { type: String, required: false },
  handledBy: { type: String, required: true, default: "pending" },
  coOrdinatorStatus: {
    type: String,
    enum: ["Rejected", "Aprroved", "Pending"],
    default: "Pending",
    required: false,
  },
  status: {
    type: String,
    enum: ["Rejected", "Aprroved", "Pending"],
    default: "Pending",
  },
});

module.exports.schema = schema;
