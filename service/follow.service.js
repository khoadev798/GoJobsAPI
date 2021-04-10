const mongoose = require("mongoose");
const GLOBAL = require("../global/global");
const Follow = require("../model/follow");
const FollowModel = mongoose.model("Follow", Follow);

let createFlcFollowEmp = async (follow) => {
  follow["createdAt"] = new Date();
  follow["createdBy"] = follow.flcId;
  let followInstance = new FollowModel(follow);
  await followInstance.save((err, doc) => {
    if (err) return console.log(err);
    console.log("follow: ", doc);
  });

  return { code: GLOBAL.SUCCESS_CODE, message: "created follow employer" };
};

let createFlcFollowJob = async (follow) => {
  follow["createdAt"] = new Date();
  follow["createdBy"] = follow.flcId;
  let followJobInstance = new FollowModel(follow);
  await followJobInstance.save((err) => {
    if (err) return console.log(err);
  });
  return { code: GLOBAL.SUCCESS_CODE, message: "created flc follow job" };
};

let createEmpFollowFlc = async (follow) => {
  follow["createdAt"] = new Date();
  follow["createdBy"] = follow.empId;
  let followFlcInstance = new FollowModel(follow);
  await followFlcInstance.save((err) => {
    if (err) return console.log(err);
  });
  return { code: GLOBAL.SUCCESS_CODE, message: "created emp follow flc" };
};

let getJobByFlcFollow = async (follow) => {
  let found = await FollowModel.find(
    {
      $and: [{ flcId: follow.flcId }, { createdBy: { $eq: follow.flcId } }],
    },
    "jobId",
    {
      skip: (follow.pageNumber - 1) * follow.pageSize,
      limit: follow.pageNumber * follow.pageSize,
    }
  )
    .populate("jobId")
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
      $and: [{ flcId: follow.flcId }, { createdBy: { $eq: follow.flcId } }],
    },
    "empId",
    {
      skip: (follow.pageNumber - 1) * follow.pageSize,
      limit: follow.pageNumber * follow.pageSize,
    }
  )
    .populate("empId")
    .exec();
  if (found == undefined) {
    return { code: GLOBAL.NOT_FOUND_CODE, employers: "Missing!" };
  } else {
    return { code: GLOBAL.SUCCESS_CODE, employers: found };
  }
};

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
};
