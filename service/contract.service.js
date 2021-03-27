const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const GLOBAL = require("../global/global");
const Contract = require("../model/contract");
Contract.plugin(mongoosePaginate);
const Employer = require("../model/employer");
const Freelancer = require("../model/freelancer");
const Job = require("../model/job");
const Wallet = require("../model/wallet");
const Receipt = require("../model/receipt");
const JobModel = mongoose.model("Job", Job);
const EmployerModel = mongoose.model("Employer", Employer);
const ContractModel = mongoose.model("Contract", Contract);
const WalletModel = mongoose.model("Wallet", Wallet);
const ReceiptModel = mongoose.model("Receipt", Receipt);
const Notification = require("../model/notification");
const NotificationModel = mongoose.model("Notification", Notification);
const jobService = require("../service/job.service");
// Không dùng function này nữa
let getContractsByCondition = async (condition) => {
  let contracts = await ContractModel.find(
    {
      $and: [
        {
          contractStatus: condition.contractStatus,
        },
        {
          empId: condition.empId,
        },
        {
          flcId: condition.flcId,
        },
        {
          jobId: condition.jobId,
        },
      ],
    },
    "_id empId flcId jobId contractStatus createdAt"
  );
  let jobStatusList = [];
  contracts.forEach((contract) => {
    if (contract.jobId) {
      let query = JobModel.findOne(
        { _id: contract.jobId },
        "_id jobStatus"
      ).exec();
      jobStatusList.push(query);
    }
  });
  let jobStatusOfContracts = await Promise.all(jobStatusList).then((values) => {
    return values;
  });
  if (contracts.length > 0) {
    contracts.map((contract) => {
      jobStatusOfContracts.map((job) => {
        if (contract.jobId === job._id) {
          contract.jobStatus = job.jobStatus;
        }
        return contract;
      });
    });
    return { code: 200, contracts };
  } else {
    return { code: 200, contracts: "Chưa có phát sinh trong mục này" };
  }
};

let getOneContractWithSpecifiedInfo = async (contract) => {
  console.log("Contract at check", contract);
  let oneContract = await ContractModel.findOne(
    {
      $or: [
        {
          _id: mongoose.Types.ObjectId(contract._id),
        },
        {
          flcId: mongoose.Types.ObjectId(contract.flcId),
          empId: mongoose.Types.ObjectId(contract.empId),
          jobId: mongoose.Types.ObjectId(contract.jobId),
        },
      ],
    },
    (error, doc) => {
      if (error) return handleError(err);
    }
  );
  // console.log("Query result", oneContract);
  if (oneContract) {
    return { code: 200, contract: oneContract };
  } else {
    return { code: 404, contract: "Contract not found!" };
  }
};

let createNewContractAtSituation = async (contract) => {
  let queryContractResult = await getOneContractWithSpecifiedInfo(contract);
  const session = await mongoose.startSession();
  session.startTransaction();
  if (queryContractResult.code == 404) {
    contract["createdAt"] = new Date();
    contract["createdBy"] = contract.flcId;
    let contractInstance = new ContractModel(contract);
    await contractInstance.save((err, obj) => {
      if (err) return handleError(err);
    });
   let listTokens = await findTokenDeviceEmp(contract);
   let Tokens = [];
  Tokens = listTokens.listTokens.empTokenDevice

   let notification = {
    flcId: contract.flcId,
    empId: contract.empId,
    jobId: contract.jobId,
    createdBy: "Freelancer",
    createdAt: new Date(),
  };
  let notificationInstance = new NotificationModel(notification);
  await notificationInstance.save(notification, (err, doc) => {
    if (err) handleError(err);
    return console.log(doc);
  });
  var message = {
    data: {
      score: '850',
      time: '2:45'
    },
    notification:{
      title : 'Navish',
      body : 'Test notifi employer by navish'
    }
  };
 jobService.FCM.sendToMultipleToken(message, Tokens, function(err, response) {
      if(err){
          console.log('err--', err);
      }else {
          console.log('response-----', response);
      }

  })

   await session.commitTransaction();
   session.endSession();
    return { code: 200, message: "Thao tac thanh cong!" };
  } else {
    return { code: 409, message: "Contract da ton tai!" };
  }
};

let findTokenDeviceEmp = async (contract)=>{
  let found = await EmployerModel.findOne(
    {_id: contract.empId},
    "empTokenDevice",
    (err, doc) =>{
      if(err) handleError(err);
      return doc;
    }
  );
  if(found == undefined){
    return {code: GLOBAL.NOT_FOUND_CODE, message: "Employer khong ton tai"}
  }else{
    return {code: GLOBAL.SUCCESS_CODE, listTokens: found}
  }
}

let deleteContractById = async (contract) => {
  let deleteResult = await ContractModel.deleteOne(
    {
      _id: contract._id,
    },
    (err) => {
      if (err) return handleError(err);
    }
  );
  // console.log(deleteResult);
  return { code: 200, messsage: "Thao tac da duoc thuc hien" };
};

let flcJoinQueryWithJobOrEmployer = async (contract) => {
  // 2 initial conditions: {flcId : contract.flcId, contractStatus : "INTEREST || APPLIED"}
  // Join contract with Job to get jobStatus
  // Job join with Employer to get employer info
  let match = {
    $match: {
      flcId: mongoose.Types.ObjectId(contract.flcId),
      contractStatus: contract.contractStatus,
      createdBy: contract.flcId,
    },
  };
  let aggregate = {
    $lookup: {
      from: "jobs",
      localField: "jobId",
      foreignField: "_id",
      as: "job",
    },
  };

  // BỎ FOLLOW CỦA CONTRACT
  // if (contract.contractStatus == "FOLLOW") {
  //   aggregate = {
  //     $lookup: {
  //       from: "employers",
  //       localField: "empId",
  //       foreignField: "_id",
  //       as: "employer",
  //     },
  //   };
  // } else {
  // }
  let contractList = await ContractModel.aggregate([match, aggregate]);
  console.log("DS contract", contractList);
  return { code: 200, contractList };
};

let getFollowsOfEmpForFlc = async (contract) => {
  let match = {
    $match: {
      empId: mongoose.Types.ObjectId(contract.empId),
      contractStatus: "FOLLOW",
      createBy: contract.empId,
    },
  };
  let aggregate = {
    $lookup: {
      from: "freelancers",
      localField: "flcId",
      foreignField: "_id",
      as: "freelancer",
    },
  };
  let followList = await ContractModel.aggregate([match, aggregate]);
  console.log("FollowList of Emp for Flc", followList);
  return { code: 200, followList };
};

let getContractsByJobIdAndContractStatus = async (contract) => {
  let match = {
    $match: {
      jobId: mongoose.Types.ObjectId(contract.jobId),
      contractStatus: contract.contractStatus || "APPLIED",
    },
  };
  let aggregate = {
    $lookup: {
      from: "freelancers",
      localField: "flcId",
      foreignField: "_id",
      as: "freelancer",
    },
  };
  let contractList = await ContractModel.aggregate([match, aggregate]);
  console.log("Thong tin Contract, Emp theo JobId", contractList);
  return { code: 200, contractList };
};

let updateStatusOfContractById = async (contract) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  let filter = {
    _id: mongoose.Types.ObjectId(contract._id),
    contractStatus: { $ne: "APPROVED" },
    contractStatus: { $ne: "COMPLETED" },
    contractStatus: { $ne: "CANCELLED" },
  };
  let currentContract = await ContractModel.findOne(filter);
  const CHOICES = ["INTEREST", "APPLIED", "ACCEPTED", "REJECTED"];
  // APPROVED, CANCELLED, COMPLETED need to be seperated
  let update = {
    contractStatus: CHOICES.includes(contract.contractStatus)
      ? contract.contractStatus
      : currentContract.contractStatus,
    updatedBy: contract.updatedBy,
    updatedAt: new Date(),
  };

  let updatedResult = await ContractModel.findOneAndUpdate(
    filter,
    update,
    {
      new: true,
    },
    (err) => {
      if (err) return handleError(err);
    }
  );
  // let walletFilter = {};
  // if (updatedResult.contractStatus == "ACCEPTED") {
  //   flcWalletFilter = {
  //     createdBy: { $eq: updatedResult.flcId },
  //   };
  //   let currentFlcWallet = await WalletModel.findOne(flcWalletFilter);
  //   let flcWalletUpdate = {
  //     $set: {
  //       balance:
  //         currentFlcWallet.balance +
  //         (updatedResult.jobTotalSalaryPerHeadCount * 25) / 100,
  //       updatedBy: contract.empId,
  //       updatedAt: new Date(),
  //     },
  //   };
  //   let updatedWalletOfFlc = await WalletModel.findOneAndUpdate(
  //     flcWalletFilter,
  //     flcWalletUpdate,
  //     {
  //       new: true,
  //     }
  //   );
  // }
  await session.commitTransaction();
  session.endSession();
  return { code: 200, message: "Cap nhat thanh cong!" };
};

//  mongoose.Types.ObjectId

let markContractsCompletedAndPayFreelancers = async (_idContractList) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  let contractFilter = {
    _id: { $in: _idContractList },
    contractStatus: { $eq: "APPROVED" },
  };
  let contractList = await ContractModel.find(contractFilter);
  console.log("Paying contracts", contractList);
  if (contractList.length > 0) {
    // Lấy các freelancers từ flcId của contractList liên quan và cộng tiền vào wallet của họ
    let queryList = [];
    contractList.forEach(async (contract) => {
      let walletFilter = {
        createdBy: { $eq: contract.flcId },
      };
      let currentFlcWallet = WalletModel.findOne(walletFilter).exec();
      queryList.push(currentFlcWallet);
    });
    let flcWalletList = await Promise.all(queryList).then((values) => {
      return values;
    });
    console.log("flcWalletList", flcWalletList);
    let updateWalletList = [];
    let updateContractList = [];
    let createReceiptForFlcList = [];
    let createReceiptForSystem = [];
    contractList.forEach((contract, index) => {
      let walletFilter = {
        createdBy: { $eq: contract.flcId },
      };
      let walletUpdate = {
        $set: {
          balance:
            flcWalletList[index].balance +
            (contract.jobTotalSalaryPerHeadCount * 65) / 100,
          updatedBy: contract.empId,
          updatedAt: new Date(),
        },
      };
      let receiptInfoForFlc = {
        updatedValue: contract.jobTotalSalaryPerHeadCount * 0.65,
        receiverId: "flc#" + contract.flcId,
        senderId: "emp#" + contract.empId,
        createdAt: new Date(),
        createdBy: contract.empId,
      };

      let receiptInfoForSystem = {
        updatedValue: contract.jobTotalSalaryPerHeadCount * 0.1,
        receiverId: "SYSTEM",
        senderId: "emp#" + contract.empId,
        createdAt: new Date(),
        createdBy: "emp#" + contract.empId,
      };

      let flcReceiptInstance = new ReceiptModel(receiptInfoForFlc);
      let systemReceiptInstance = new ReceiptModel(receiptInfoForSystem);
      let flcReceipt = flcReceiptInstance.save({ session: sesssion }).finally();
      let systemReceipt = systemReceiptInstance
        .save({ session: session })
        .finally();
      createReceiptForFlcList.push(flcReceipt);
      createReceiptForSystem.push(systemReceipt);
      let updateWalletBalance = WalletModel.findOneAndUpdate(
        walletFilter,
        walletUpdate,
        {
          new: true,
        }
      ).exec();
      let updateContractStatus = ContractModel.findOneAndUpdate(
        {
          _id: contract._id,
        },
        {
          $set: {
            contractStatus: "COMPLETED",
            updatedBy: contract.empId,
            updatedAt: new Date(),
          },
        },
        {
          new: true,
        }
      ).exec();
      updateWalletList.push(updateWalletBalance);
      updateContractList.push(updateContractStatus);
    });
    let updatedFlcWalletList = await Promise.all(updateWalletList).then(
      (values) => {
        return values;
      }
    );
    let complatedContractList = await Promise.all(updateContractList).then(
      (values) => {
        return values;
      }
    );
    let createdReceiptsForFlc = await Promise.all(createReceiptForFlcList).then(
      (values) => {
        return values;
      }
    );

    let createdReceiptsForSystem = await Promise.all(
      createdReceiptsForSystem
    ).then((values) => {
      return values;
    });

    console.log("DS Wallet da nhan tien", updatedFlcWalletList);
    console.log("DS Contract da COMPLETED", complatedContractList);
    console.log("DS Receipt cua FLC", createdReceiptsForFlc);
    console.log("DS Receipt cua System", createdReceiptsForSystem);
    await session.commitTransaction();
    session.endSession();
    return { code: 200, result: "Thanh toán các Contract thành công!" };
  } else {
    return { code: 404, result: "Không có contract phù hợp để thanh toán!" };
  }
};

let markOneContractCancelled = async (_idContract) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  let contractFilter = {
    _id: mongoose.Types.ObjectId(_idContract),
    contractStatus: { $eq: "APPROVED" },
  };
  let involvedContract = await ContractModel.findOne(contractFilter);

  if (involvedContract) {
    let flcWalletFilter = {
      createdBy: { $eq: involvedContract.flcId },
    };
    let involvedFlcWallet = await WalletModel.findOne(flcWalletFilter);

    let empWalletFilter = {
      createdBy: { $eq: involvedContract.empId },
    };
    let involvedEmpWallet = await WalletModel.findOne(empWalletFilter);
    let contractUpdate = {
      contractStatus: "CANCELLED",
      updatedBy: involvedContract.flcId,
      updatedAt: new Date(),
    };
    let flcWalletUpdate = {
      balance:
        involvedFlcWallet.balance +
        involvedContract.jobTotalSalaryPerHeadCount * 0.3,
      updatedBy: involvedContract.flcId,
      updatedAt: new Date(),
    };
    let empWalletUpdate = {
      balance:
        involvedEmpWallet.balance -
        involvedContract.jobTotalSalaryPerHeadCount * 0.35,
      updatedBy: involvedContract.flcId,
      updatedAt: new Date(),
    };
    let updatedContract = await ContractModel.findOneAndUpdate(
      contractFilter,
      contractUpdate,
      { new: true }
    );
    let updatedFlcWallet = await WalletModel.findOneAndUpdate(
      flcWalletFilter,
      flcWalletUpdate,
      { new: true }
    );
    let updatedEmpWallet = await WalletModel.findOneAndUpdate(
      empWalletFilter,
      empWalletUpdate,
      { new: true }
    );

    let receiptForFlcInfo = {
      receiverId: "flc#" + involvedContract.flcId,
      senderId: "emp#" + involvedContract.empId,
      updatedValue: involvedContract.jobTotalSalaryPerHeadCount * 0.3,
      createdAt: new Date(),
      createdBy: "emp#" + involvedContract.empId,
    };
    let receiptForFlcInstance = new ReceiptModel(receiptForFlcInfo);
    let finalReceiptForFlc = await receiptForFlcInstance.save({
      session: session,
    });
    let receiptForEmpInfo = {
      receiverId: "emp#" + involvedContract.empId,
      senderId: "emp#" + involvedContract.empId,
      updatedValue: involvedContract.jobTotalSalaryPerHeadCount * 0.35,
      createdAt: new Date(),
      createdBy: "emp#" + involvedContract.empId,
    };
    let receiptForEmpInstance = new ReceiptModel(receiptForEmpInfo);
    let finalReceiptForEmp = await receiptForEmpInstance.save({
      session: session,
    });
    let receiptForSystemInfo = {
      receiverId: "SYSTEM",
      senderId: "emp#" + involvedContract.empId,
      updatedValue: involvedContract.jobTotalSalaryPerHeadCount * 0.1,
      createdAt: new Date(),
      createdBy: "emp#" + involvedContract.empId,
    };
    let receiptForSystemInstance = new ReceiptModel(receiptForSystemInfo);
    let finalReceiptForSystem = await receiptForSystemInstance.save({
      session: session,
    });
    console.log("Cacelled contract", updatedContract);
    console.log("Updated flcWallet", updatedFlcWallet);
    console.log("Update empWallet", updatedEmpWallet);
    console.log(
      "Created receipts",
      finalReceiptForFlc,
      finalReceiptForEmp,
      finalReceiptForSystem
    );
    await session.commitTransaction();
    session.endSession();
    return { code: 200, result: "Contract đã bị huỷ." };
  } else {
    await session.commitTransaction();
    session.endSession();
    return { code: 404, result: "Không có contract phù hợp!" };
  }
};

let contractPaginationForWebAdmin = async (pagination) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  let searchRegex = new RegExp(pagination.search, "i");
  let match = {
    $match: {
      $and: [
        { jobId: mongoose.Types.ObjectId(pagination.jobId) },
        {
          $or: [{ contractStatus: { $regex: searchRegex } }],
        },
      ],
    },
  };

  join = {
    $lookup: {
      from: "freelancers",
      localField: "flcId",
      foreignField: "_id",
      as: "freelancer",
      // $project: "empEmail",
    },
  };

  let skip = {
    $skip: (pagination.pageNumber - 1) * pagination.pageSize,
  };
  let limit = {
    $limit: pagination.pageNumber * pagination.pageSize,
  };

  let sort;
  let contractsAndFreelancerWithCondition;
  if (pagination.sort) {
    sort = {
      $sort: { contractStatus: pagination.sort == "asc" ? 1 : -1 },
    };
    contractsAndFreelancerWithCondition = await ContractModel.aggregate([
      match,
      join,
      skip,
      limit,
      sort,
      {
        $project: {
          _id: 1,
          contractStatus: 1,
          createdAt: 1,
          "freelancer._id": 1,
          "freelancer.flcEmail": 1,
        },
      },
    ]);
  } else {
    contractsAndFreelancerWithCondition = await ContractModel.aggregate([
      match,
      join,
      skip,
      limit,
      {
        $project: {
          _id: 1,
          contractStatus: 1,
          createdAt: 1,
          "freelancer._id": 1,
          "freelancer.flcEmail": 1,
        },
      },
    ]);
  }
  // console.log(contractsAndFreelancerWithCondition);
  let contractCount = await ContractModel.countDocuments({
    $and: [
      { jobId: mongoose.Types.ObjectId(pagination.jobId) },
      {
        $or: [{ contractStatus: { $regex: searchRegex } }],
      },
    ],
  });

  await session.commitTransaction();
  session.endSession();
  // console.log(contractCount);
  let pageCount = Math.ceil(contractCount / 5);
  return {
    code: 200,
    contracts: contractsAndFreelancerWithCondition,
    pageCount,
  };
};

module.exports = {
  getContractsByCondition,
  createNewContractAtSituation,
  deleteContractById,
  flcJoinQueryWithJobOrEmployer,
  getFollowsOfEmpForFlc,
  getContractsByJobIdAndContractStatus,
  updateStatusOfContractById,
  markContractsCompletedAndPayFreelancers,
  markOneContractCancelled,
  contractPaginationForWebAdmin,
};
