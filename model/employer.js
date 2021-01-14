const mongoose = require("mongoose");
<<<<<<< HEAD
const Schema = mongoose.Schema;

const Company = new Schema({
  // coTypeId: { type: Schema.Types.ObjectId, required: true },
  coName: { type: String, required: true },
  coEmail: { type: String, required: true },
  coPassword: { type: String, required: true },
  coPhone: { type: String, required: true },
  coAddress: { type: String, required: true },
  coTaxCode: { type: String, required: true },
  coLogo: { type: String, required: true, default: null },
  coDescription: { type: String, required: true },
  coStatus: { type: String, required: true, default: "Pending" },
  coTypeId: { type: Schema.Types.ObjectId, ref: "CompanyType", required: true },
  createdAt: { type: Date, min: "1990-01-01", max: "2099-01-01" },
  updatedAt: {
=======

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

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
>>>>>>> 0c210c6 (Employer)
    type: Date,
    min: "1990-01-01",
    max: "2099-01-01",
    default: null,
  },
<<<<<<< HEAD
  confirmedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
});

module.exports = Company;
=======
});

module.exports = Employer;
>>>>>>> 0c210c6 (Employer)
