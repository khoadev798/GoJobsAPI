const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const GLOBAL = require("../global/global");
const Contract = require("../model/contract");
Contract.plugin(mongoosePaginate);
const Employer = require("../model/employer");
const Freelancer = require("../model/freelancer");
const Job = require("../model/job");
const Wallet = require("../model/wallet");
const JobModel = mongoose.model("Job", Job);
const EmployerModel = mongoose.model("Employer", Employer);
const ContractModel = mongoose.model("Contract", Contract);
const WalletModel = mongoose.model("Wallet", Wallet);

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
  if (queryContractResult.code == 404) {
    contract["createdAt"] = new Date();
    let contractInstance = new ContractModel(contract);
    await contractInstance.save((err, obj) => {
      if (err) return handleError(err);
    });
    return { code: 200, message: "Thao tac thanh cong!" };
  } else {
    return { code: 409, message: "Contract da ton tai!" };
  }
};

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
    contractList.forEach((contract, index) => {
      let walletFilter = {
        createdBy: { $eq: contract.flcId },
      };
      let walletUpdate = {
        $set: {
          balance:
            flcWalletList[index].balance +
            (contract.jobTotalSalaryPerHeadCount * 70) / 100,
          updatedBy: contract.empId,
          updatedAt: new Date(),
        },
      };
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
    console.log("DS Wallet da nhan tien", updatedFlcWalletList);
    console.log("DS Contract da COMPLETED", complatedContractList);
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

    console.log("Cacelled contract", updatedContract);
    console.log("Updated flcWallet", updatedFlcWallet);
    console.log("Update empWallet", updatedEmpWallet);
    await session.commitTransaction();
    session.endSession();
    return { code: 200, result: "Contract đã bị huỷ." };
  } else {
    await session.commitTransaction();
    session.endSession();
    return { code: 404, result: "Không có contract phù hợp!" };
  }
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
};
