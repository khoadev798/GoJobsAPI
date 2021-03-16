const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Freelancer = require("../model/freelancer");
const Job = require("../model/job");

const Notification = new Schema({
    flcId: {type: Schema.Types.ObjectId, ref: "Freelancer", required: true},
    jobId: {type: Schema.Types.ObjectId, ref: "Job", required: true},
    createdAt: {type: Date}
})

module.exports = Notification;