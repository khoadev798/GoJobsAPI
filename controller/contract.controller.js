const contractService = require("../service/contract.service");

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

let addNewContract = (req, res) => {
  let { jobId, flcId, empId, contractStatus } = req.query;
  res.send("New contract");
};

module.exports = {
  getContractsByStatus,
  addNewContract,
};
