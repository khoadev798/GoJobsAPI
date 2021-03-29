const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Employer = require("../model/employer");
const Freelancer = require("../model/freelancer");
const Job = require("../model/job");

const Follow = new Schema({
    jobId: {type: Schema.Types.ObjectId, ref: "Job", default: null },
    empId: { type: Schema.Types.ObjectId, ref: "Employer", default: null },
    flcId: { type: Schema.Types.ObjectId, ref: "Freelancer", default: null},
    createdBy: {type: String, required:true},
    createdAt: {type: Date},
});

module.exports = Follow;