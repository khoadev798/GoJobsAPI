const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Freelancer = new Schema({
  // coTypeId: { type: Schema.Types.ObjectId, required: true },
  flcTokenDevice: { type: [String], default: [], required: true },
  flcEmail: { type: String, required: true },
  flcPassword: { type: String, required: true },
  flcName: { type: String, default: null },
  flcPhone: { type: String, default: null },
  flcBirthday: { type: String, default: null },
  flcAvatar: { type: String, default: null },
  flcSex: { type: String, default: null },
  flcAddress: { type: String, default: null },
  flcEdu: { type: String, default: null },
  flcMajor: { type: String, default: null },
  flcJobTitle: { type: String, default: null },
  flcRating: { type: Number, default: 5 },
  flcLanguages: { type: String, default: null },
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
