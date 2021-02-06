const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Wallet = new Schema({
  empId: { type: Schema.Types.ObjectId, ref: "Employer", default: null },
  flcId: { type: Schema.Types.ObjectId, ref: "Freelancer", default: null },
  createdBy: { type: String, required: true },
  createdAt: { type: Date, required: true },
  updatedBy: { type: String, default: null },
  updatedAt: { type: Date, default: null },
  balance: { type: Number, default: 0 },
});
module.exports = Wallet;
