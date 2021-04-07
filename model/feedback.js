const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Freelancer = require("./freelancer");
const Job = require("./job");
const Employer = require("./employer");

const Feedback = new Schema({
  jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
  empId: { type: Schema.Types.ObjectId, ref: "Employer", required: true },
  flcId: { type: Schema.Types.ObjectId, ref: "Freelancer", required: true },
  starRating: { type: Number, default: 5 },
  comment: { type: String, default: "" },
  createdBy: { type: String, required: true },
  createdAt: { type: Date },
});

module.exports = Feedback;
