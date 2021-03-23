const flcService = require("../service/freelancer.service");

let createFreelancer = async (req, res) => {

  let { flcEmail, flcPassword, flcTerm, flcName, flcPhone } = req.body;

  console.log("new freelancer: ", flcEmail);

  let flcCreateResult = await flcService.flcCreate({
    flcEmail,
    flcPassword,
    flcTerm,
    flcName,
    flcPhone,
  });
  res.status(flcCreateResult.code).send(flcCreateResult.message);
};

let loginFreelancer = async (req, res, next) => {
  let { flcEmail, flcPassword, flcTokenDevice } = req.body;
  console.log("Freelancer login: " + flcEmail);
  let flcLoginResult = await flcService.login({
    flcEmail,
    flcPassword,

    flcTokenDevice

  });

  res.status(flcLoginResult.code).send({
    message: flcLoginResult.message,
    _id: flcLoginResult._id,
    flcEmail: flcLoginResult.flcEmail,
    accessToken: flcLoginResult.accessToken,
  });
};

let getAllFreelancer = async (req, res) => {
  let flcList = await flcService.getAllFreelancer();
  res.status(200).send(flcList);
};

let updateFreelancerInfo = async (req, res) => {
  let {
    flcEmail,
    flcName,
    flcPhone,
    flcBirthday,
    flcAvatar,
    flcSex,
    flcAddress,
    flcEdu,
    flcMajor,
    flcJobTitle,
    flcLanguages,
  } = req.query;
  const updatedInfoResult = await flcService.flcUpdateInfo({
    flcName,
    flcEmail,
    flcPhone,
    flcBirthday,
    flcAvatar,
    flcSex,
    flcAddress,
    flcEdu,
    flcMajor,
    flcJobTitle,
    flcLanguages,
  });
  res.status(updatedInfoResult.code).send(updatedInfoResult.doc);
};

let flcPagination = async (req, res) => {
  let { search, sort, filter, pageNumber, pageSize } = req.query;
  console.log(filter);
  let pagingResult = await flcService.flcPagination({
    search,
    sort,
    filter,
    pageNumber,
    pageSize,
  });
  res.status(pagingResult.code).send(pagingResult.freelancers);
};

let updateTokenWithFlcId = async (req, res) =>{
  let {_id, flcTokenDevice} = req.query;
  let updateTokenWithFlcIdResult = await flcService.updateTokenWithFlcId({
    _id,
    flcTokenDevice,
  });
  res.status(updateTokenWithFlcIdResult.code).send(updateTokenWithFlcIdResult.message);
}

let updatePassword = async (req, res)=>{
  let {flcEmail, flcPassword, flcNewPassword} = req.body;
  let updatedPasswordResult = await flcService.updatePassword({
    flcEmail,
    flcPassword,
    flcNewPassword
  });
    res.status(updatedPasswordResult.code).send(updatedPasswordResult.message);
  
}

module.exports = {
  createFreelancer,
  getAllFreelancer,
  updateFreelancerInfo,
  loginFreelancer,
  flcPagination,
  updateTokenWithFlcId,
  updatePassword
};
