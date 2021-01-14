const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const JobType = require("../model/jobType");
const Employer = require("../model/employer");
const Freelancer = require("../model/freelancer");

const Job = new Schema({
    jobTypeId: {type: Schema.Types.ObjectId('JobType'), required: true},
    emId: {type: Schema.Types.ObjectId('Employer'), required: true},
    flcId: {type: Schema.Types.ObjectId('Freelancer'), default: null},
    requestId: {type: String, required: true},
    salaryPerHour: {type: String, required: true},
    hasExperience: {type: String, required: true},
    timeStart: {type: Date, required: true},
    timeEndS: {type: Date, required: true},
    contentDes: {type: String, required: true},
    title: {type: String},
    status: {type: Boolean, required:true},
    createdAt: {type: Date.now()},

});

module.exports = Job;