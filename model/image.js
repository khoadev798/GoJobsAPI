const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Image = Schema({
  image: { type: String },
});

module.exports = Image;
