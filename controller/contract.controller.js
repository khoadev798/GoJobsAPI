const contractService = require("../service/contract.service");
var mongoose = require("mongoose");

let addNewContract = async (req, res) => {
  let {
    jobId,
    flcId,
    empId,
    contractStatus,
    createdBy,
    jobTotalSalaryPerHeadCount,
  } = req.query;

  let createContractResult = await contractService.createNewContractAtSituation(
    {
      jobId,
      flcId,
      empId,
      contractStatus,
      createdBy,
      jobTotalSalaryPerHeadCount,
    }
  );

  res.status(createContractResult.code).send(createContractResult.message);
};

let deleteContractById = async (req, res) => {
  let { _id } = req.query;
  let deleteResult = await contractService.deleteContractById({ _id });
  res.status(deleteResult.code).send(deleteResult.messsage);
};

let getContractsByStatusOfFlc = async (req, res) => {
  let { flcId } = req.query;
  let queryResult = await contractService.flcJoinQueryWithJobOrEmployer({
    flcId,
  });
  res.status(queryResult.code).send(queryResult.contractList);
};

let getFollowOfEmpForFlc = async (req, res) => {
  let { empId } = req.query;
  let followQueryResult = await contractService.getFollowsOfEmpForFlc({
    empId,
  });
  res.status(followQueryResult.code).send(followQueryResult.followList);
};

let getContractsByJobIdAndContractStatus = async (req, res) => {
  let { jobId, contractStatus } = req.query;
  let queryResult = await contractService.getContractsByJobIdAndContractStatus({
    jobId,
    contractStatus,
  });
  res.status(queryResult.code).send(queryResult.contractList);
};

let updateContractStatusById = async (req, res) => {
  let { _id, contractStatus, updatedBy } = req.query;
  let updateResult = await contractService.updateStatusOfContractById({
    _id,
    contractStatus,
    updatedBy,
  });
  res.status(updateResult.code).send(updateResult.message);
};

// 60165ee6f26cce54115bf10e
module.exports = {
  getContractsByStatusOfFlc,
  addNewContract,
  deleteContractById,
  getFollowOfEmpForFlc,
  getContractsByJobIdAndContractStatus,
  updateContractStatusById,
};
