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
  res.code(createContractResult.code).send(createContractResult.message);
};

module.exports = {
  getContractsByStatus,
  addNewContract,
};
