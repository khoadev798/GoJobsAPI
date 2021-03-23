const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Employer = require("../model/employer");
const Freelancer = require("../model/freelancer");

const Follow = new Schema({
    empId: { type: Schema.Types.ObjectId, ref: "Employer", required: true },
    flcId: { type: Schema.Types.ObjectId, ref: "Freelancer", required: true },
    createdAt: {type: Date},
});

module.exports = Follow;