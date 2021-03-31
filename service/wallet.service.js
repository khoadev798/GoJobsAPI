const GLOBAL = require("../global/global");
const mongoose = require("mongoose");
const Wallet = require("../model/wallet");
const Employer = require("../model/employer");
const Freelancer = require("../model/freelancer");
const Contract = require("../model/contract");
const Job = require("../model/job");
const Receipt = require("../model/receipt");
const WalletModel = mongoose.model("Wallet", Wallet);
const EmployerModel = mongoose.model("Employer", Employer);
const FreelancerModel = mongoose.model("Freelancer", Freelancer);
const ContractModel = mongoose.model("Contract", Contract);
const JobModel = mongoose.model("Job", Job);
const ReceiptModel = mongoose.model("Receipt", Receipt);
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
  let flcWalletUpdateAQuarter = [];
  let receiptList = [];
  involvedContracts.forEach((contract) => {
    totalPayment += contract.jobTotalSalaryPerHeadCount;
    // Lấy thông tin của flc liên quan và tính 1/4 số tiền tổng trả
    flcWalletUpdateAQuarter.push({
      flcId: contract.flcId,
      firstPaymentForFlc: contract.jobTotalSalaryPerHeadCount * 0.25,
    });
    receiptList.push({
      updatedValue: contract.jobTotalSalaryPerHeadCount * 0.25,
      receiverId: contract.flcId,
      senderId: contract.empId,
      createdBy: contract.empId,
      createdAt: new Date(),
    });
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
    // Xử lý thanh toán: 1. Trừ tiền, 2. Bỏ 25% số tiền từng flcWallet theo contract, 3. Tạo các receipt cho flc  ,4. update contract isPaymentFullyCompleted true 5. update job
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

    // let empReceitpInstance = new ReceiptModel(receiptForEmployer);

    // Cộng 25% số tiền vào wallet của flc liên quan
    let updateFlcWalletList = [];

    console.log("FLC info", flcWalletUpdateAQuarter);
    flcWalletUpdateAQuarter.forEach((task) => {
      let oneFlcWalletUpdate = WalletModel.findOneAndUpdate(
        {
          $or: [{ flcId: task.flcId }, { createdBy: task.flcId }],
        },
        {
          $inc: { balance: task.firstPaymentForFlc },
          updatedBy: currentWallet.empId,
          uơdatedAt: new Date(),
        },
        { new: true }
      ).exec();

      updateFlcWalletList.push(oneFlcWalletUpdate);
    });

    let updatedFlcWalletList = await Promise.all(updateFlcWalletList).then(
      (results) => {
        console.log("Đã cho 25% tiền vào wallet của Flc liên quan!", results);
      }
    );
    // tạo các receipt khi flc nhận tiền
    let createReceiptList = [];
    console.log("Receipt info", receiptList);
    receiptList.forEach((receipt) => {
      receiptInstance = new ReceiptModel(receipt);
      let newReceipt = receiptInstance.save({ session: session }).finally();
      createReceiptList.push(newReceipt);
    });

    let createdReceiptList = await Promise.all(createReceiptList).then(
      (receipts) => {
        console.log("Đã ghi chép các receipt!", receipts);
      }
    );

    let receiptForEmp = {
      senderId: walletOwnerId,
      updatedValue: -totalPayment,
      createdAt: new Date(),
      createdBy: walletOwnerId,
    };
    let receiptForEmpInstance = new ReceiptModel(receiptForEmp);
    let createdReceiptForEmp = await receiptForEmpInstance.save({
      session: session,
    });

    console.log("Emp bi tru tien", createdReceiptForEmp);
    // update các contracts ở bước này
    let contractUpdate = {
      $set: {
        isPaymentFullyCompleted: true,
        contractStatus: "APPROVED",
        updatedAt: new Date(),
        updatedBy: currentWallet.empId,
      },
    };
    let updateContractsResult = await ContractModel.updateMany(
      contractFilter,
      contractUpdate,
      { new: true }
    );
    // tiếp tục update jobPaidContractCount ở job từ current với currentjob
    let jobFilter = {
      _id: jobId,
    };

    let jobUpdate = {
      $inc: { jobPaidContractCount: updateContractsResult.n },
    };
    let updatedJob = await JobModel.findOneAndUpdate(jobFilter, jobUpdate, {
      new: true,
    });
    await session.commitTransaction();
    session.endSession();
    console.log("Updated wallet", updatedWallet);
    // console.log("Updated wallets of FLC", updatedFlcWalletList);
    // console.log("Created receipts", createdReceiptList);
    console.log("Updated contracts", updateContractsResult);
    console.log("Updated job", updatedJob);
    return {
      code: 200,
      result: `Thanh toán thành công cho ${updateContractsResult.n} hợp đồng!`,
    };
  }
};

let updateWalletBalanceByIdOnWebAdmin = async (wallet) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  let updatedWallet = await WalletModel.findByIdAndUpdate(
    { _id: wallet.walletId },
    {
      $inc: { balance: wallet.balance },
      updatedBy: wallet.adminId,
      updatedAt: new Date(),
    },
    { new: true }
  );

  let receiptInfo = {};
  if (wallet.empId) {
    receiptInfo["receiverId"] = "emp#" + wallet.empId;
  } else if (wallet.flcId) {
    receiptInfo["receiverId"] = "flc#" + wallet.flcId;
  }
  receiptInfo["isCreatedByAdmin"] = wallet.isCreatedByAdmin;
  receiptInfo["createdAt"] = new Date();
  receiptInfo["updatedValue"] = wallet.balance;
  if (wallet.adminId) {
    receiptInfo["createdBy"] = wallet.adminId;
    receiptInfo["senderId"] = "SYSTEM";
  }
  let receiptInstance = new ReceiptModel(receiptInfo);
  let createdReceipt = await receiptInstance.save({ session });
  await session.commitTransaction();
  session.endSession();
  if (updatedWallet) {
    console.log(updatedWallet);
    return { code: 200, message: "Cập nhật thành công!" };
  } else {
    return { code: 400, message: "Gặp lỗi!" };
  }
};

let getWallByEndUserId = async(endUser) =>{
  let wallet = await WalletModel.findOne(
    {createdBy: endUser._id},
    "balance"
  ).exec()
  console.log("wallet: ", wallet);
  if(wallet){
    return {code: GLOBAL.SUCCESS_CODE, wallet: wallet}
  }else{
    return {code: GLOBAL.NOT_FOUND_CODE, wallet: "missing!"}
  }
}

module.exports = {
  createWallet,
  getWallByEndUserId,
  getWalletOfEndUserByCreatedBy,
  payForAcceptedContractsProcedure,
  updateWalletBalanceByIdOnWebAdmin,
};
