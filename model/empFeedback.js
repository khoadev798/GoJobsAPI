const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Freelancer = require("../model/freelancer");
const Job = require("../model/job");
const Employer = require("../model/employer");

const EmpFeedback = new Schema({
  jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
  empId: { type: Schema.Types.ObjectId, ref: "Employer", required: true },
  flcId: { type: Schema.Types.ObjectId, ref: "Freelancer", required: true },
  starRating: { type: Number, required: true},
  flcComment: { type: String, required: true },
  createdAt: { type: Date },
});

module.exports = EmpFeedback;
