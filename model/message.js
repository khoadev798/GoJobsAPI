const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Employer = require("../model/employer");
const Freelancer = require("../model/freelancer");

const Message = new Schema({
    empId: {type: Schema.Types.ObjectId, ref:"Employer", required: true},
    flcId: { type: Schema.Types.ObjectId, ref: "Freelancer", required: true},
    content: [{
        userId: {type: String, required:true},
        message: {type: String, required:true},
    }],
    createdAt: {type: Date, required: true},
})

module.exports = Message;