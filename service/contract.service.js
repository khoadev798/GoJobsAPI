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

let updateStatusOfContract = (contract) => {};

module.exports = { getContractsByCondition, createNewContractAtSituation };
