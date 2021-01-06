const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Company = new Schema({
  // coTypeId: { type: Schema.Types.ObjectId, required: true },

  coName: { type: String, required: true },
  coEmail: { type: String, required: true },
  coPassword: { type: String, required: true },
  coPhone: { type: String, required: true },
  coAddress: { type: String, required: true },
  coTaxCode: { type: String, required: true },
  coLogo: { type: String, required: true },
  coDescription: { type: String, required: true },
  coStatus: { type: String, required: true, default: "Pending" },
  coTypeId: { type: Schema.Types.ObjectId, ref: "CompanyType" },
  createdAt: { type: Date, min: "1990-01-01", max: "2099-01-01" },
  updatedAt: {
    type: Date,
    min: "1990-01-01",
    max: "2099-01-01",
    default: null,
  },
  confirmedBy: { type: Schema.Types.ObjectId, ref: "User" },
  updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
});

module.exports = CompanyType;
