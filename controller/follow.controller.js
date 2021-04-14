const followService = require("../service/follow.service");

let createFlcFollowEmp = async (req, res) => {
  let { empId, flcId, createdBy } = req.query;

  let createFollowResult = await followService.createFlcFollowEmp({
    flcId,
    empId,
    createdBy
  });
  res.status(createFollowResult.code).send(createFollowResult.message);
};

let createEmpFollowFlc = async (req, res) => {
  let { empId, flcId, createdBy } = req.query;
  let createEmpFollowFlcResult = await followService.createEmpFollowFlc({
    flcId,
    empId,
    createdBy
  });
  res
    .status(createEmpFollowFlcResult.code)
    .send(createEmpFollowFlcResult.message);
};

let createFlcFollowJob = async (req, res) => {
  let { flcId, jobId, createdBy } = req.query;
  let createFlcFollowJobResult = await followService.createFlcFollowJob({
    flcId,
    jobId,
    createdBy
  });
  res
    .status(createFlcFollowJobResult.code)
    .send(createFlcFollowJobResult.message);
};

let getFlcByEmpFollow = async (req, res) => {
  let { empId, pageNumber, pageSize } = req.query;
  let getFlcByEmpFollowResult = await followService.getFlcByEmpFollow({
    empId,
    pageNumber,
    pageSize,
  });
  res
    .status(getFlcByEmpFollowResult.code)
    .send(getFlcByEmpFollowResult.freelancers);
};

let getJobByFlcFollow = async (req, res) => {
  let { flcId, pageNumber, pageSize } = req.query;
  let getJobByFlcFollowResult = await followService.getJobByFlcFollow({
    flcId,
    pageNumber,
    pageSize,
  });
  res.status(getJobByFlcFollowResult.code).send(getJobByFlcFollowResult.jobs);
};

let delFollow = async (req, res) => {
  let { empId, flcId, jobId, createdBy } = req.query;

  let delFollowResult = await followService.delFollow({
    flcId,
    empId,
    jobId,
    createdBy,
  });
  res.status(delFollowResult.code).send(delFollowResult.message);
};

let getEmpByFlcFollow = async (req, res) =>{
  let {flcId} = req.query;
  let getEmpByFlcFollowResult = await followService.getEmpByFlcFollow({flcId});
  res.status(getEmpByFlcFollowResult.code).send(getEmpByFlcFollowResult.employers);
}

// let updateTokenWithFlcId = async (req, res) => {
//     let {flcId, tokenDeviceWithFlc} = req.query;

//     let updateTokenWithFlcIdResult = await followService.updateTokenWithFlcId({
//         flcId,
//         tokenDeviceWithFlc,
//     });
//     res.status(updateTokenWithFlcIdResult.code).send(updateTokenWithFlcIdResult.message);
// }

module.exports = {
  createFlcFollowEmp,
  delFollow,
  createEmpFollowFlc,
  createFlcFollowJob,
  getFlcByEmpFollow,
  getJobByFlcFollow,
  getEmpByFlcFollow,
  //updateTokenWithFlcId,
};
