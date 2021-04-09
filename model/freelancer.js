const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Freelancer = new Schema({
  // coTypeId: { type: Schema.Types.ObjectId, required: true },
  flcTokenDevice: { type: [String], default: [], required: true },
  flcEmail: { type: String, required: true },
  flcPassword: { type: String, required: true },
  flcName: { type: String, default: "" },
  flcPhone: { type: String, default: "" },
  flcBirthday: { type: String, default: "" },
  flcAvatar: { type: String, default: "" },
  flcSex: { type: String, default: "" },
  flcAddress: { type: String, default: "" },
  flcEdu: { type: String, default: "" },
  flcMajor: { type: String, default: "" },
  flcJobTitle: { type: String, default: "" },
  flcRating: { type: Number, default: 5 },
  flcLanguages: { type: String, default: "" },
  flcTerm: { type: Boolean, required: true },
  createdAt: { type: Date },
  updatedPasswordAt: {
    type: Date,
  },
  updatedInfoAt: {
    type: Date,
  },
  // confirmedBy: { type: Schema.Types.ObjectId, ref: "User" },
  // updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
});

module.exports = Freelancer;
