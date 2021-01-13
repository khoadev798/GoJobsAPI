const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CompanyType = new Schema({
  // coTypeId: { type: Schema.Types.ObjectId, required: true },
  coTypeName: { type: String, required: true },
  createdAt: { type: Date, min: "1990-01-01", max: "2099-01-01" },
  updatedAt: {
    type: Date,
    min: "1990-01-01",
    max: "2099-01-01",
    default: null,
  },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
});

module.exports = CompanyType;
