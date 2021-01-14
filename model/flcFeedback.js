const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Freelancer = require("../model/freelancer");
const Job = require("../model/job");
const Employer = require("../model/employer");

const FlcFeedback = new Schema({
  jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
  emId: { type: Schema.Types.ObjectId, ref: "Employer", required: true },
  flcId: { type: Schema.Types.ObjectId, ref: "Freelancer", required: true },
  starRating: { type: [Number], default: [] },
  flcComment: { type: String, required: true },
  createdAt: { type: Date },
});

module.exports = FlcFeedback;
