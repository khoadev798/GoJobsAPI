const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Freelancer = new Schema({
  // coTypeId: { type: Schema.Types.ObjectId, required: true },

  flcEmail: { type: String, required: true },
  flcPassword: { type: String, required: true },
  flcFirstName: { type: String, default: null },
  flcLastName: { type: String, default: null },
  flcPhone: { type: String, default: null },
  flcBirthday: { type: Date, default: null },
  flcAvatar: { type: String, default: null },
  flcSex: { type: String, default: null },
  flcAddress: { type: String, default: null },
  flcEdu: { type: String, default: null },
  flcMajor: { type: String,default: null },
  flcJobTitle: { type: String, default: null },
  flcBeginExp: { type: Date, default: null },
  flcFinishExp: { type: Date, default: null },
  flcLanguages: { type: String, default: null },
  createdAt: { type: Date.now()},
  updatedPasswordAt: {
    type: Date.now()
  },
  updatedInfoAt: {
    type: Date.now()
  },
  // confirmedBy: { type: Schema.Types.ObjectId, ref: "User" },
  // updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
});

module.exports = Freelancer;
