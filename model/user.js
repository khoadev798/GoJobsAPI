const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;


const User =  new Schema({
    email: {type: String, required: true},
    name: String,
    password: {type: String, required: true},
    salt: {type: String, required: true},
})

module.exports = User