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

  if (contracts.length > 0) {
    return { code: 200, contracts };
  } else {
    return { code: 200, contracts: "Chưa có phát sinh trong mục này" };
  }
};

let updateStatusOfContract = (contract) => {};

module.exports = { getContractsByCondition };
