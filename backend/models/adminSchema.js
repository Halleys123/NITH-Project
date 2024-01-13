const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: {
    type: String,
    required: true,
    enum: ["admin", "gateMan"],
  },
  gateNo: {
    type: Number,
    default: null,
    enum: [1, 2, null],
  },
});

const collection = mongoose.model("admins", adminSchema);
module.exports = collection;
