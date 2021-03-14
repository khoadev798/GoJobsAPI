const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Employer = require("../model/employer");

const Bill = new Schema({
    empId: {type: Schema.Types.ObjectId, ref: "Employer", required: true},
    money: {type: Number, default: 0},
    createdBy: {type:String, default: null},
    createdAt: {type:Date},
});

module.exports = Bill;