const mongoose = require("mongoose");
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
  empName: { type: String, default: null },
  empType: {type: String, default: null},
  empEmail: { type: String, required: true },
  empPassword: { type: String, required: true },
  empNationalId: { type: String, default: null},
  empPhone: { type: String, default: null },
  empAddress: { type: String, default: null },
  empTaxCode: { type: String, default: null },
  empLogo: { type: String, default: null },
  empDescription: { type: String, default: null },
  empTerm: { type: String, required: true },
  empStatus: { type: String, required: true, default: "Pending" },
  createdAt: { type: Date },
  confirmedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  confirmedAt: {
    type: Date,
    default: null,
  },
  updatedPasswordAt: { type: Date, default: null },
  updatedInfoAt: {
    type: Date,
    default: null,
  },
  salt: { type: String, required: true },
  
});

module.exports = Employer;
