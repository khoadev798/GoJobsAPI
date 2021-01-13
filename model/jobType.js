const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const JobType = new Schema({
    jobTypeName : {type: String, required: true}

});

module.exports = JobType;