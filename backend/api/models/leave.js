const mongoose = require(`mongoose`);

const schema = new mongoose.Schema({
  typeOfLeave: { type: String, required: true },
  numberOfLeave: { type: Number, required: true },
  authority: {
    type: [String],
    required: true,
    enum: ["H.O.D", "Mentor", "Faculty", "Co-Ordinator", "Principal"],
  },
  leaveName: { type: String, required: false, unique: true },
  leaveDate: { type: Date, required: false },
});

module.exports.schema = schema;
