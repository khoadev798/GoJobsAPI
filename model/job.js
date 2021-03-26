const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Employer = require("../model/employer");
const Freelancer = require("../model/freelancer");

const Job = new Schema({
  empId: { type: Schema.Types.ObjectId, ref: "Employer", required: true },
  jobTitle: { type: String, required: true },
  jobDescription: { type: String, required: true },
  jobPaymentType: { type: String, required: true }, // ("Hourly", "Daily", "Weekly", "After-done"  )
  jobSalary: { type: Number, default: null },
  // jobSalaryPerDay: { type: Number, default: null },
  // jobSalaryPerWeek: { type: Number, default: null },
  jobSalaryAfterDone: { type: Number, default: null },
  experienceRequired: { type: Boolean, default: false },
  jobField: { type: String, required: true }, // ("LDPT", "IT", "F&B",...)
  jobStart: { type: String, reqired: true },
  jobEnd: { type: String, reqired: true },
  jobDuration: { type: Number, required: true },
  jobPublishDate: { type: Date, default: null },
  jobStatus: { type: String, default: "Open" },
  jobTotalSalaryPerHeadCount: { type: Number, default: null },
  jobHeadCountTarget: { type: Number, default: 1 },
  jobPaidContractCount: { type: Number, default: 0 },
  jobAddress: { type: String },
  updatedBy: { type: Date, default: null },
  updatedAt: { type: Date, default: null },
});

module.exports = Job;
