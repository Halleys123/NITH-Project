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
      reason: { type: String, enum: ["market", "home"], default: "market" },
    },
  ],
});
const collection = mongoose.model("students", studentSchema);

module.exports = collection;
