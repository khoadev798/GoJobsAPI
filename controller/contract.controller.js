const contractService = require("../service/contract.service");
var mongoose = require("mongoose");
let getContractsByStatus = (req, res) => {
  let { contractStatus, empId, jobId, flcId } = req.query;
  let contractsByConditionsResult = contractService.getContractsByCondition({
    contractStatus,
    empId,
    jobId,
    flcId,
  });
  res.send("Get contracts with specific info");
};

let addNewContract = async (req, res) => {
  let { jobId, flcId, empId, contractStatus } = req.query;
  let createContractResult = await contractService.createNewContractAtSituation(
    {
      jobId,
      flcId,
      empId,
      contractStatus,
    }
  );
  res.status(createContractResult.code).send(createContractResult.message);
};

let deleteContractById = async (req, res) => {
  let { _id } = req.query;
  let deleteResult = await contractService.deleteContractById({ _id });
  res.status(deleteResult.code).send(deleteResult.messsage);
};

let getInterestedOrAppliedJobsInfo = async (req, res) => {
  let { flcId, contractStatus } = req.query;
  let queryResult = await contractService.joinQueryWithEmployerToGetFullInfoForInterestedJob(
    { flcId, contractStatus }
  );
  res.send(queryResult);
};

// 60165ee6f26cce54115bf10e
module.exports = {
  getContractsByStatus,
  addNewContract,
  deleteContractById,
  getInterestedOrAppliedJobsInfo,
};
