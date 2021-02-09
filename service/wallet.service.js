const GLOBAL = require("../global/global");
const mongoose = require("mongoose");
const Wallet = require("../model/wallet");
const Employer = require("../model/employer");
const Freelancer = require("../model/freelancer");
const Contract = require("../model/contract");
const Job = require("../model/job");
const WalletModel = mongoose.model("Wallet", Wallet);
const EmployerModel = mongoose.model("Employer", Employer);
const FreelancerModel = mongoose.model("Freelancer", Freelancer);
const ContractModel = mongoose.model("Contract", Contract);
const JobModel = mongoose.model("Job", Job);
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
  contractIds,
  jobId
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
    empId: { $eq: walletOwnerId },
    contractStatus: { $eq: "ACCEPTED" },
  };
  let currentWallet = await WalletModel.findOne(walletFilter);
  let involvedContracts = await ContractModel.find(contractFilter);
  // tiếp theo cần so sánh tiền tổng của các contract và wallet hiện tại đang có
  // thanh toán được tất cả thì trừ balance currentWallet update involvedContracts sang APPROVED và isPaymentFullyCompleted true
  // Người dùng update các contract APPROVED thành COMPLETED, thực hiện ck vào ví cho các freelancer với phần jobTotalSalaryPerHeadCount
  console.log("Wallet", currentWallet);
  console.log("Contracts", involvedContracts);
  let totalPayment = 0;
  involvedContracts.forEach((contract) => {
    totalPayment += contract.jobTotalSalaryPerHeadCount;
  });
  console.log(
    "Balance vs Payment",
    `${currentWallet.balance} & ${totalPayment}` +
      (currentWallet.balance < totalPayment ? " NOT ENOUGH" : " ENOUGH")
  );
  if (currentWallet.balance < totalPayment) {
    // Trả về ko đủ tiền và yêu cầu nạp thêm
    await session.commitTransaction();
    session.endSession();
    return {
      code: 400,
      result: "Ban không đủ tiền để thanh toán. Vui lòng nạp thêm.",
    };
  } else {
    // Xử lý thanh toán: 1. Trừ tiền, 2. update contract isPaymentFullyCompleted true 3. update job
    let walletUpdate = {
      balance: currentWallet.balance - totalPayment,
      updatedAt: new Date(),
      updatedBy: currentWallet.empId,
    };
    console.log("Remained balance:", `${walletUpdate.balance}`);
    let updatedWallet = await WalletModel.findOneAndUpdate(
      walletFilter,
      walletUpdate,
      { new: true }
    );
    let contractUpdate = {
      $set: {
        isPaymentFullyCompleted: true,
        contractStatus: "APPROVED",
        updatedAt: new Date(),
        updatedBy: currentWallet.empId,
      },
    };
    // update các contracts ở bước này
    let updateContractsResult = await ContractModel.updateMany(
      contractFilter,
      contractUpdate,
      { new: true }
    );
    // tiếp tục update jobPaidContractCount ở job từ current với currentjob
    let jobFilter = {
      _id: jobId,
    };
    let currentJob = await JobModel.findOne(jobFilter);
    let jobUpdate = {
      jobPaidContractCount:
        currentJob.jobPaidContractCount + updateContractsResult.n,
    };
    let updatedJob = await JobModel.findOneAndUpdate(jobFilter, jobUpdate, {
      new: true,
    });
    await session.commitTransaction();
    session.endSession();
    console.log("Updated wallet", updatedWallet);
    console.log("Updated contracts", updateContractsResult);
    console.log("Updated job", updatedJob);
    return {
      code: 200,
      result: `Thanh toán thành công cho ${updateContractsResult.n} hợp đồng!`,
    };
  }
};
module.exports = {
  createWallet,
  getWalletOfEndUserByCreatedBy,
  payForAcceptedContractsProcedure,
};