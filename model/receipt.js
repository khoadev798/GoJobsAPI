const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Job = require("../model/job");
const Employer = require("../model/employer");
const Freelancer = require("../model/freelancer");

const Receipt = new Schema({
  receiverId: { type: String },
  senderId: { type: String },
  createdBy: { type: String },
  createdAt: { type: Date, required: true },
  isCreatedByAdmin: { type: Boolean, default: false },
  updatedValue: { type: Number, required: true },
});

module.exports = Receipt;
