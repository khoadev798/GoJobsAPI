const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const JobType = require("../model/jobType");
const Employer = require("../model/employer");
const Freelancer = require("../model/freelancer");

const Job = new Schema({
  jobTypeId: { type: Schema.Types.ObjectId, ref: "JobType", required: true },
  empId: { type: Schema.Types.ObjectId, ref: "Employer", required: true },
  flcId: { type: Schema.Types.ObjectId, ref: "Freelancer", default: null },
  requestId: { type: String, required: true },
  salaryPerHour: { type: String, required: true },
  hasExperience: { type: String, default: null },
  timeStart: { type: Date, required: true },
  timeEnd: { type: Date, required: true },
  contentDes: { type: String, required: true },
  title: { type: String },
  status: { type: Boolean, required: true },
  createdAt: { type: Date },
  updatedBy: { type: Date, default: null },
  updatedAt: { type: Date, default: null },
});

const Job2 = new Schema({
  jobTypeId: { type: Schema.Types.ObjectId, ref: "JobType", required: true },
  empId: { type: Schema.Types.ObjectId, ref: "Employer", required: true },
  // requestId: {type: }, // ???
  jobTitle: { type: String, required: true },
  jobDescription: { type: String, required: true },
  jobPaymentType: { type: String, required: true }, // ("Hourly", "Daily", "Weekly", "Àfter-done"  )
  jobSalaryPerHour: { type: Number, default: null },
  jobSalaryPerDay: { type: Number, default: null },
  jobSalaryPerWeek: { type: Number, default: null },
  jobSalaryAfterDone: { type: Number, default: null },
  experiencedRequired: { type: Boolean, default: false },
  jobField: { type: String, default: "Chan tay" },
  jobStart: { type: Date, reqired: true },
  jobEnd: { type: Date, reqired: true },
  jobPublishDate: { type: Date, reqired: true },
  jobStatus: { type: String, default: "On-going" },
  jobHeadCount: { type: Number, default: 1 },
});

module.exports = Job;
