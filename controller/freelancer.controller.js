const flcService = require("../service/freelancer.service");

let createFreelancer = async (req, res) => {
  let { flcEmail, flcPassword, flcTerm } = req.body;

  console.log("new freelancer: ", flcEmail);

  let flcCreateResult = await flcService.flcCreate({
    flcEmail,
    flcPassword,
    flcTerm,
  });
  res.status(flcCreateResult.code).send(flcCreateResult.message);
};

let loginFreelancer = async (req, res, next) => {
  let { flcEmail, flcPassword, flcTokenDevice } = req.body;
  console.log("Freelancer login: " + flcEmail);
  let flcLoginResult = await flcService.login({
    flcEmail,
    flcPassword,

    flcTokenDevice,
  });

  res.status(flcLoginResult.code).send({
    message: flcLoginResult.message,
    _id: flcLoginResult._id,
    flcEmail: flcLoginResult.flcEmail,
    accessTokenDb: flcLoginResult.accessTokenDb,
    flcName: flcLoginResult.flcName,
  });
};

let getAllFreelancer = async (req, res) => {
  let flcList = await flcService.getAllFreelancer();
  res.status(200).send(flcList);
};

let updateFreelancerInfo = async (req, res) => {
  let {
    _id,
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
  } = req.body;
  const updatedInfoResult = await flcService.flcUpdateInfo({
    _id,
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
  });
  console.log(updatedInfoResult.code);
  res.status(updatedInfoResult.code).send(updatedInfoResult.freelancer);
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

let flcPaginationAll = async (req, res) => {
  let { sort, pageNumber, pageSize } = req.query;
  let flcPaginationAllResult = await flcService.flcPaginationAll({
    sort,
    pageNumber,
    pageSize,
  });
  res
    .status(flcPaginationAllResult.code)
    .send(flcPaginationAllResult.freelancers);
};

let getFieldForSearchFlc = async (req, res) =>{
  let getFieldForSearchFlcResult = await flcService.getFieldForSearchFlc();
  res.status(getFieldForSearchFlcResult.code).send(getFieldForSearchFlcResult.result);
}

let flcPaginationWithAddress = async (req, res) => {
  let { sort, search, pageNumber, pageSize } = req.query;
  let flcPaginationWithAddressResult = await flcService.flcPaginationWithAddress(
    {
      sort,
      search,
      pageNumber,
      pageSize,
    }
  );
  res
    .status(flcPaginationWithAddressResult.code)
    .send(flcPaginationWithAddressResult.freelancers);
};

let updateTokenWithFlcId = async (req, res) => {
  let { _id, flcTokenDevice } = req.query;
  let updateTokenWithFlcIdResult = await flcService.updateTokenWithFlcId({
    _id,
    flcTokenDevice,
  });
  res
    .status(updateTokenWithFlcIdResult.code)
    .send(updateTokenWithFlcIdResult.message);
};

let updatePassword = async (req, res) => {
  let { flcEmail, flcPassword, flcNewPassword } = req.body;
  let updatedPasswordResult = await flcService.updatePassword({
    flcEmail,
    flcPassword,
    flcNewPassword,
  });
  res.status(updatedPasswordResult.code).send(updatedPasswordResult.message);
};

let findFreelancerById = async (req, res) => {
  let { _id } = req.query;
  let findFreelancerByIdResult = await flcService.findFreelancerById({ _id });

    res.status(findFreelancerByIdResult.code).send(findFreelancerByIdResult.freelancer);
};

module.exports = {
  findFreelancerById,
  createFreelancer,
  getAllFreelancer,
  updateFreelancerInfo,
  loginFreelancer,
  flcPagination,
  updateTokenWithFlcId,
  updatePassword,
  flcPaginationAll,
  flcPaginationWithAddress,
  getFieldForSearchFlc
};
