const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Job = require("../model/job");
const Employer = require("../model/employer");
const Freelancer = require("../model/freelancer");

const Receipt = new Schema({
  to: { type: String },
  from: { type: String },
  createdBy: { type: String },
  createdAt: { type: Date, required: true },
  isCreatedByAdmin: { type: Boolean, default: false },
  updatedBalance: { type: Number, required: true },
});

module.exports = Receipt;
