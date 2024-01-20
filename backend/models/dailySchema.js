const mongoose = require("mongoose");
const dailySchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
    default: new Date().toLocaleDateString(),
  },
  data: [
    {
      rollNo: { type: String },
      searchId: { type: mongoose.Schema.ObjectId, ref: "students" },
      exitDate: { type: Date },
      entryDate: { type: Date },
      exitGate: { type: Number },
      isLate: { type: Boolean, default: false },
      expectedEntryDate: { type: Date },
      entryGate: { type: Number },
      reason: { type: String, enum: ["market", "home"], default: "market" },
    },
  ],
});
module.exports = mongoose.model("dailyData", dailySchema);
