const mongoose = require("mongoose");
const dailySchema = new mongoose.Schema({
  date: { type: Date, required: true },
  data: [
    {
      rollNo: { type: Number },
      searchId: { type: mongoose.Schema.ObjectId, ref: "students" },
      exitDate: { type: Date },
      entryDate: { type: Date },
      exitGate: { type: Number },
      entryGate: { type: Number },
      reason: { type: Number, enum: [0, 1] },
    },
  ],
});
module.exports = mongoose.model("dailyData", dailySchema);
