// const db = require("mongodb");
const mongoose = require("mongoose");
const Wallet = require("../model/wallet");
const Employer = require("../model/employer");
const Freelancer = require("../model/freelancer");
const WalletModel = mongoose.model("Wallet", Wallet);
const EmployerModel = mongoose.model("Employer", Employer);
const FreelancerModel = mongoose.model("Freelancer", Freelancer);

let createWallet = async (endUser, session) => {
  // console.log("EndUser of Employer", endUser instanceof EmployerModel);
  let walletInfo = {
    empId:
      endUser instanceof EmployerModel
        ? mongoose.Types.ObjectId(endUser._id)
        : null,
    flcId:
      endUser instanceof FreelancerModel
        ? mongoose.Types.ObjectId(endUser._id)
        : null,
    createdBy: endUser._id,
    createdAt: new Date(),
  };
  let walletInstance = new WalletModel(walletInfo);
  let createdWallet = await walletInstance.save({ session: session });
  return createdWallet;
};

module.exports = { createWallet };
