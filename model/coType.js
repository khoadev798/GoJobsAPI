const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CompanyType = new Schema({
  // coTypeId: { type: Schema.Types.ObjectId, required: true },
  coTypeName: { type: String, required: true },
});

module.exports = CompanyType;
