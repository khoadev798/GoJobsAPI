const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Freelancer = require("../model/freelancer");
const Job = require("../model/job");
const Employer = require("../model/employer");

const FlcFeedback = new Schema({
    
    jobId: { type: Schema.Types.ObjectId('Job'), required: true },
    emId: {type: Schema.Types.ObjectId('Employer'), required: true},
    flcId: {type: Schema.Types.ObjectId('Freelancer'), required: true},
    starRating: { type: Int8Array, required: true },
    flcComment: {type: String, required: true},
    createdAt: { type: Date.now()},
 
});

module.exports = FlcFeedback;
