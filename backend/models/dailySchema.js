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
      entryGate: { type: Number },
      reason: { type: String, enum: ["market", "home"] },
    },
  ],
});
module.exports = mongoose.model("dailyData", dailySchema);
