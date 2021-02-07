const GLOBAL = require("../global/global");
const mongoose = require("mongoose");
const Wallet = require("../model/wallet");
const Employer = require("../model/employer");
const Freelancer = require("../model/freelancer");
const Contract = require("../model/contract");
const WalletModel = mongoose.model("Wallet", Wallet);
const EmployerModel = mongoose.model("Employer", Employer);
const FreelancerModel = mongoose.model("Freelancer", Freelancer);
const ContractModel = mongoose.model("Contract", Contract);

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

let getWalletOfEndUserByCreatedBy = async (endUser) => {
  let wallet = await WalletModel.findOne({
    createdBy: endUser._id,
  });
  if (wallet) {
    return { code: 200, wallet };
  } else {
    return { code: 400, wallet: "Loi khong tim duoc vi!" };
  }
};

let payForAcceptedContractsProcedure = async (
  _id,
  walletOwnerId,
  contractIds
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  // Tìm Wallet đang thanh toán hiện tại
  let walletFilter = {
    $or: [{ _id: mongoose.Types.ObjectId(_id) }, { createdBy: walletOwnerId }],
  };
  // Tìm các Contract đang được thanh toán
  let contractFilter = {
    _id: { $in: contractIds },
    empId: mongoose.Types.ObjectId(walletOwnerId),
    contractStatus: "ACCEPTED",
  };
  let currentWallet = await WalletModel.findOne(walletFilter);
  let involvedContracts = await ContractModel.find(contractFilter);
  // tiếp theo cần so sánh tiền tổng của các contract và wallet hiện tại đang có
  // thanh toán được tất cả thì trừ balance currentWallet update involvedContracts sang APPROVED và isPaymentFullyCompleted true
  // Người dùng update các contract APPROVED thành COMPLETED, thực hiện ck vào ví cho các freelancer với phần jobTotalSalaryPerHeadCount
  console.log("Wallet", currentWallet);
  console.log("Contracts", involvedContracts);
  await session.commitTransaction();
  session.endSession();
  return "OK";
};
module.exports = {
  createWallet,
  getWalletOfEndUserByCreatedBy,
  payForAcceptedContractsProcedure,
};
