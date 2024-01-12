const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  rollNo: {
    required: true,
    type: String,
    unique: true,
  },
  isOut: {
    type: Boolean,
    default: false,
  },
  history: [
    {
      exitDate: { type: Date },
      entryDate: { type: Date },
      exitGate: { type: Number },
      entryGate: { type: Number },
      reason: { type: Number, enum: [0, 1] },
    },
  ],
});
const collection = mongoose.model("students", studentSchema);
collection.reasonArray = ["market", "home"];
module.exports = collection;
