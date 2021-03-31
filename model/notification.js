const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Follow = require("../model/follow");
const Job = require("../model/job");
const Employer = require("../model/employer")

const Notification = new Schema({
    empId: {type: Schema.Types.ObjectId, ref: "Employer" , required: true},
    flcId: [{type: Schema.Types.ObjectId, ref: "Follow", required: true}],
    jobId: {type: Schema.Types.ObjectId, ref: "Job", required: true},
    content: {type: String, required: true},
    createdBy: {type: String , required:true},
    createdAt: {type: Date},
})

module.exports = Notification;