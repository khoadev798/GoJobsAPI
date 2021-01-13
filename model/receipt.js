const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Job = require("../model/job");
const Employer = require("../model/employer");
const Freelancer = require("../model/freelancer");

const Receipt = new Schema({
    jobId: {type: Schema.Types.ObjectId('Job'), required: true},
    emId: {type: Schema.Types.ObjectId('Employer'), required: true},
    flcId: {type: Schema.Types.ObjectId('Freelancer'), required: true},
    emName: {type: String, required:true},
    flcName: {type: String, required: true},
    createdAt: {type: Date.now()},
    estimateFare: {type: Int8Array, required: true},
});

module.exports = Receipt;