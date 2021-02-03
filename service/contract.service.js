const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const GLOBAL = require("../global/global");
const Contract = require("../model/contract");
Contract.plugin(mongoosePaginate);
const Employer = require("../model/employer");
const Job = require("../model/job");
const JobModel = mongoose.model("Job", Job);
const EmployerModel = mongoose.model("Employer", Employer);
const ContractModel = mongoose.model("Contract", Contract);

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
  let oneContract = await ContractModel.findOne({
    $or: [
      {
        _id: contract._id,
      },
      {
        flcId: contract.flcId,
        empId: contract.empId,
      },
      {
        flcId: contract.flcId,
        jobId: contract.jobId,
      },
    ],
  });
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
    },
  };
  let aggregate = {};
  if (contract.contractStatus == "FOLLOW") {
    aggregate = {
      $lookup: {
        from: "employers",
        localField: "empId",
        foreignField: "_id",
        as: "employer",
      },
    };
  } else {
    aggregate = {
      $lookup: {
        from: "jobs",
        localField: "jobId",
        foreignField: "_id",
        as: "job",
      },
    };
  }

  let contractList = await ContractModel.aggregate([match, aggregate]);
  console.log("DS contract", contractList);
  return { code: 200, contractList };
};

let getFollowsOfEmpForFlc = async (contract) => {
  let match = {
    $match: {
      empId: mongoose.Types.ObjectId(contract.empId),
      contractStatus: "FOLLOW",
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
  let filter = {
    _id: contract._id,
  };
  let update = {
    contractStatus: contract.contractStatus,
  };
  let updateResult = await ContractModel.findOneAndUpdate(
    filter,
    update,
    {
      new: true,
    },
    (err) => {
      if (err) return handleError(err);
    }
  );
  return { code: 200, message: "Cap nhat thanh cong!" };
};

module.exports = {
  getContractsByCondition,
  createNewContractAtSituation,
  deleteContractById,
  flcJoinQueryWithJobOrEmployer,
  getFollowsOfEmpForFlc,
  getContractsByJobIdAndContractStatus,
  updateStatusOfContractById,
};
