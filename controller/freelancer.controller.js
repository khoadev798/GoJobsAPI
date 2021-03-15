const flcService = require("../service/freelancer.service");

let createFreelancer = async (req, res) => {
  let { flcEmail, flcPassword, flcTerm } = req.query;
  console.log("new freelancer: ", flcEmail);
  
    let flcCreateResult = await flcService.flcCreate({
      flcEmail,
      flcPassword,
      flcTerm,
    });
    res.status(flcCreateResult.code).send(flcCreateResult.message);
  }

let loginFreelancer = async (req, res, next) => {
  let { flcEmail, flcPassword } = req.query;
  console.log("Freelancer login: " + flcEmail);
  let flcLoginResult = await flcService.login({
    flcEmail,
    flcPassword
  });
  if(flcLoginResult.code == 200){
    res.status(flcLoginResult.code).send({
      message: flcLoginResult.message,
      _id : flcLoginResult._id,
      accessToken: flcLoginResult.accessToken
    });
  }

};

let getAllFreelancer = async (req, res) => {
  let flcList = await flcService.getAllFreelancer();
  res.status(200).send(flcList);
};


let updateFreelancerInfo = async (req, res) =>{
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
    } =  req.query;
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
}

let flcPagination = async (req, res) =>{
  let {search, sort, filter, pageNumber, pageSize } = req.query;
  console.log(filter);
  let pagingResult = await flcService.flcPagination({
    search,
    sort,
    filter,
    pageNumber,
    pageSize,
  });
  res.status(pagingResult.code).send(pagingResult.freelancers);
}

module.exports = {
  createFreelancer,
  getAllFreelancer,
  updateFreelancerInfo,
  loginFreelancer,
  flcPagination,
};
