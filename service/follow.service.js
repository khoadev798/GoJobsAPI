const mongoose = require("mongoose");
const GLOBAL = require("../global/global");
const Follow = require("../model/follow");
const FollowModel = mongoose.model("Follow", Follow);

let createFlcFollowEmp = async (follow) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  let followJobExisted = await findFollow(follow);
  console.log("code: " + followJobExisted.code)
  if(followJobExisted.code == 200){
   await delFollow(follow);
  }else{
    follow["createdAt"] = new Date();
    let followJobInstance = new FollowModel(follow);
    await followJobInstance.save((err) => {
      if (err) return console.log(err);
    });
  }
  await session.commitTransaction();
  session.endSession();
  
  return { code: GLOBAL.SUCCESS_CODE, message: "created follow employer" };
};

let createFlcFollowJob = async (follow) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  let followJobExisted = await findFollow(follow);
  console.log("code: " + followJobExisted.code)
  if(followJobExisted.code == 200){
   await delFollow(follow);
  }else{
    follow["createdAt"] = new Date();
    let followJobInstance = new FollowModel(follow);
    await followJobInstance.save((err) => {
      if (err) return console.log(err);
    });
  }
  await session.commitTransaction();
  session.endSession();
  return { code: GLOBAL.SUCCESS_CODE, message: "success!" };
};

let createEmpFollowFlc = async (follow) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  let followJobExisted = await findFollow(follow);
  console.log("code: " + followJobExisted.code)
  if(followJobExisted.code == 200){
   await delFollow(follow);
  }else{
    follow["createdAt"] = new Date();
    let followJobInstance = new FollowModel(follow);
    await followJobInstance.save((err) => {
      if (err) return console.log(err);
    });
  }
  await session.commitTransaction();
  session.endSession();
  return { code: GLOBAL.SUCCESS_CODE, message: "created emp follow flc" };
};

let getJobByFlcFollow = async (follow) => {
  let found = await FollowModel.find(
    {
      $and: [{ flcId: follow.flcId }, { createdBy: { $eq: follow.flcId } }, {empId: { $eq: null } }],
    },
    "jobId",
    {
      skip: (follow.pageNumber - 1) * follow.pageSize,
      limit: follow.pageNumber * follow.pageSize,
    }
  )
    .populate("jobId", "jobTitle jobPaymentType jobSalary jobStart jobEnd jobStatus jobHeadCountTarget")
    .exec()
    .then((doc) => {
      return doc;
    });
  if (found == undefined) {
    return { code: GLOBAL.NOT_FOUND_CODE, jobs: "missing!" };
  } else {
    return { code: GLOBAL.SUCCESS_CODE, jobs: found };
  }
};

let getFlcByEmpFollow = async (follow) => {
  let found = await FollowModel.find(
    {
      $and: [{ empId: follow.empId }, { createdBy: { $eq: follow.empId } }],
    },
    "flcId",
    {
      skip: (follow.pageNumber - 1) * follow.pageSize,
      limit: follow.pageNumber * follow.pageSize,
    }
  )
    .populate("flcId")
    .exec();
  if (found == undefined) {
    return { code: GLOBAL.NOT_FOUND_CODE, freelancers: "Missing!" };
  } else {
    return { code: GLOBAL.SUCCESS_CODE, freelancers: found };
  }
};

let getEmpByFlcFollow = async (follow) => {
  let found = await FollowModel.find(
    {
      $and: [{ flcId: follow.flcId }, { createdBy: { $eq: follow.flcId } }, {jobId: {$eq: null}}],
    },
    "empId",
    {
      skip: (follow.pageNumber - 1) * follow.pageSize,
      limit: follow.pageNumber * follow.pageSize,
    }
  )
    .populate("empId", "empLogo empName empPhone empAddress empRating")
    .exec();
  if (found == undefined) {
    return { code: GLOBAL.NOT_FOUND_CODE, employers: "Missing!" };
  } else {
    return { code: GLOBAL.SUCCESS_CODE, employers: found };
  }
};


let findFollow = async (follow) =>{
  let found = await FollowModel.findOne(
    {$or: [
      //case flc follow job
      {
        $and: [
          {createdBy: {$eq: follow.flcId}},
          {jobId: {$eq: follow.jobId}}
        ]
      },
      //case flc follow emp
      {
        $and: [
          {createdBy: {$eq: follow.flcId}},
          {empId: {$eq: follow.empId}}
        ]
      },
      //case emp follow flc
      {
        $and: [
          {createdBy: {$eq: follow.empId}},
          {flcId: {$eq: follow.flcId}}
        ]
      },
    ]},
    {}
  ).exec();
  if(found == undefined){
    return {code: GLOBAL.NOT_FOUND_CODE, message: "follow not found!"}
  }else{
    return {code: GLOBAL.SUCCESS_CODE, message: "success!"}
  }
}

let delFollow = async (follow) => {
  let filter = {
    $or: [
      {
        //case emp follow flc
        $and: [
          { empId: follow.empId },
          { flcId: follow.flcId },
          { createdBy: follow.createdBy },
        ],
      },
      {
        //case flc follow emp
        $and: [
          { empId: follow.empId },
          { flcId: follow.flcId },
          { createdBy: follow.createdBy },
        ],
      },
      {
        //case flc follow job
        $and: [{ jobId: follow.jobId }, { flcId: follow.flcId }],
      },
    ],
  };

  await FollowModel.findOneAndDelete(filter, (err) => {
    console.log(err);
  });
  return { code: GLOBAL.SUCCESS_CODE, message: "delete Follow success!" };
};

module.exports = {
  createFlcFollowEmp,
  delFollow,
  createEmpFollowFlc,
  createFlcFollowJob,
  getFlcByEmpFollow,
  getJobByFlcFollow,
  getEmpByFlcFollow,
  findFollow
};
