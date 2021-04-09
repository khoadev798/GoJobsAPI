const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Employer = new Schema({
  empTokenDevice: { type: [String], default: [], required: true },
  empName: { type: String, default: "" },
  empType: { type: String, default: "" },
  empEmail: { type: String, required: true },
  empPassword: { type: String, required: true },
  empNationalId: { type: String, default: "" },
  empPhone: { type: String, default: "" },
  empAddress: { type: String, default: "" },
  empTaxCode: { type: String, default: "" },
  empLogo: { type: String, default: "" },
  empDescription: { type: String, default: "" },
  empTerm: { type: Boolean, required: "" },
  empRating: { type: Number, default: "" },
  empStatus: { type: String, required: true, default: "Registered" },
  createdAt: { type: Date },
  // confirmedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
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
