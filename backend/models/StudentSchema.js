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
  lateTimes: { type: Number, default: 0 },
  isAllowed: { type: Boolean, default: true },
  history: [
    {
      exitDate: { type: Date },
      entryDate: { type: Date },
      exitGate: { type: Number },
      entryGate: { type: Number },
      isLate: { type: Boolean, default: false },
      expectedEntryDate: { type: Date },
      reason: { type: String, enum: ["market", "home"], default: "market" },
    },
  ],
});
const collection = mongoose.model("students", studentSchema);

module.exports = collection;
