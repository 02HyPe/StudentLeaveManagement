const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["Student", "Admin", "Moderator"],
  },
  userId: { type: String, unique: true, required: false, spars: true },
  email: { type: String, required: true, unique: true },
  authority: {
    type: String,
    enum: [
      "Admin",
      "Principal",
      "H.O.D",
      "Mentor",
      "Faculty",
      "Co-ordinator",
      "Student",
      "NCC Student",
      "NSS Student",
      "Sports Student",
    ],
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  enrollno: {
    type: String,
    unique: true,
    sparse: true,
    validate: {
      validator: function (v) {
        return /^SR\d{2}[A-Za-z]{4}\d{3}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid enroll number!`,
    },
    required: false,
    uppercase: true,
  },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  course: { type: String, required: false },
  division: { type: String, required: false },
  department: { type: String, required: false },
  year: { type: String, required: false },
  mentor: { type: Object, required: false },
  batch: { type: Array, required: false },
  leave: { type: Number, required: true, default: 0 },
});

schema.index(
  { enrollno: 1, userId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      enrollno: { $exists: true },
      userId: { $exists: true },
    },
  }
);

module.exports.schema = schema;
