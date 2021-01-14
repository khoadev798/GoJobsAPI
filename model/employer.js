const mongoose = require("mongoose");

const Schema = mongoose.Schema;
// empTypeId;
// empName;
// empEmail;
// empPassword;
// empPhone;
// empAddress;
// empTaxcode;
// empDescription;
// empLogo;
// createdAt;
// updatedPasswordAt;
// updatedInfoAt;
// confirmedBy;
// confirmedAt;

const Employer = new Schema({
  // coTypeId: { type: Schema.Types.ObjectId, required: true },
  empName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  empPhone: { type: String, required: true },
  empAddress: { type: String, default: null },
  empTaxCode: { type: String, default: null },
  empLogo: { type: String, default: null },
  empDescription: { type: String, default: null },
  empStatus: { type: String, required: true, default: "Pending" },
  empTypeId: {
    type: Schema.Types.ObjectId,
    ref: "EmpType",
    required: true,
  },
  createdAt: { type: Date, min: "1990-01-01", max: "2099-01-01" },
  confirmedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  confirmedAt: {
    type: Date,
    min: "1990-01-01",
    max: "2099-01-01",
    default: null,
  },
  updatedPasswordAt: {
    type: Date,
    min: "1990-01-01",
    max: "2099-01-01",
    default: null,
  },
  updatedInfoAt: {
    type: Date,
    min: "1990-01-01",
    max: "2099-01-01",
    default: null,
  },

  confirmedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
});
module.exports = Employer;
