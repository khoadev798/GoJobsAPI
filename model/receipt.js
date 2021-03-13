const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Job = require("../model/job");
const Employer = require("../model/employer");
const Freelancer = require("../model/freelancer");

const Receipt = new Schema({
  empId: { type: Schema.Types.ObjectId("Employer"), required: true },
  createdAt: { type: Date.now() },
  inputAmount: { type: Number, required: true },
});

module.exports = Receipt;
