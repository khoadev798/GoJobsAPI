const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const User =  require("./user")
const Question =  new Schema({
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    title: {type: String, required: true},
    content: {type: String, required: true},
})

module.exports = Question