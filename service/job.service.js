const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const GLOBAL = require("../global/global");
const Job = require("../model/job");
Job.plugin(mongoosePaginate);
const Employer = require("../model/employer");
const JobModel = mongoose.model("Job", Job);
const EmployerModel = mongoose.model("Employer", Employer);
const Freelancer = require("../model/freelancer");
const FreelancerModel = mongoose.model("Freelancer", Freelancer);
const Follow = require("../model/follow");
const FollowModel = mongoose.model("Follow", Follow);
const util = require("../util/data.util");
const admin = require("firebase-admin");
const path = require("path");
const fcm = require("fcm-notification");
const FCM = new fcm(path.join(__dirname, "../privatefile.json"));
const Notification = require("../model/notification");

const { ObjectId } = require("bson");

const NotificationModel = mongoose.model("Notification", Notification);
// const serviceAccount = require("../privatefile.json");

let createNewJob = async (job) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  job["jobPublishDate"] = new Date();
  let jobInstance = new JobModel(job);
  await jobInstance.save({ session: session });
  let isFollowExistedResult = await isFollowExisted(job);
  if (isFollowExistedResult.code == 200) {
   
    let tokenlists = isFollowExistedResult.follow;
    let Tokens = [];
    let flcIds = [];

    tokenlists.forEach((token) => {
     
      flcIds = flcIds.concat(token.flcId);
    });
    
    let endFlcIds = await Promise.all(flcIds).then((values) => {
      return values;
    });

    let findTokenDevice = await FreelancerModel.find({
      _id: {$in: endFlcIds}
    },
      "flcTokenDevice",
      (err, docs) =>{
        if(err) handleError(err);
        return docs;
      }
    );
      findTokenDevice.forEach((token) =>{
        Tokens = Tokens.concat(token.flcTokenDevice);
      })
      let endTokens = await Promise.all(Tokens).then((values) => {
        return values;
      });
      console.log("endTokens: ", endTokens);

    let notification = {
      flcId: endFlcIds,
      empId: job.empId,
      jobId: jobInstance._id,
      content: "Vừa tạo một công việc mới",
      createdBy: "Employer",
      createdAt: new Date(),
    };
    let notificationInstance = new NotificationModel(notification);
    await notificationInstance.save(notification, (err, doc) => {
      if (err) handleError(err);
      return console.log(doc);
    });
    var message = {
      data: {
        score: '850',
        time: '2:45'
      },
      notification:{
        title : 'Navish',
        body : 'Test message by navish'
      }
    };
    FCM.sendToMultipleToken(message, endTokens, function(err, response) {
        if(err){
            console.log('err--', err);
        }else {
            console.log('response-----', response);
        }

    })
  }

  console.log("new jobs: ", jobInstance);
  await session.commitTransaction();
  session.endSession();
  return { code: GLOBAL.SUCCESS_CODE, message: "Tao job moi thanh cong" };
};

let isFollowExisted = async (job) => {
  let found = await FollowModel.find(
    { empId: job.empId },
    "flcId",
    (err, doc) => {
      if (err) return handleError(err);
      return doc;
    }
  );

  if (found == undefined) {
    return {
      code: GLOBAL.NOT_FOUND_CODE,
      message: "Follow not found!",
    };
  } else {
    return {
      code: GLOBAL.SUCCESS_CODE,
      message: "find success!",
      follow: found,
    };
  }
};


let getAllJobs = async () => {
  let jobs = [];
  await JobModel.find(
    {},
    "_id empId jobTitle jobDescription jobSalaryPerHour jobSalaryPerDay jobSalaryPerWeek jobSalaryAfterDone experienceRequired jobField jobStart jobEnd jobPublishDate jobStatus jobHeadCount",
    (err, docs) => {
      if (err) return handleError(err);
      // console.log("Current jobs", docs);
      jobs = [...docs];
      // return { code: 200, jobs: docs };
    }
  );
  if (jobs.length != 0) {
    return { code: 200, jobs };
  } else {
    return { code: 404, jobs: "Missing" };
  }
};

let getAllJobsAndEmployerInfo = async () => {
  let jobList = await getAllJobs();
  let jobs = jobList.jobs;
  let queryList = [];
  if (jobList.code == 200) {
    jobs.forEach((job, index) => {
      let query = EmployerModel.findOne(
        { _id: job._doc.empId },
        "_id empName empEmail empStatus"
      ).exec();
      queryList.push(query);
      gi;
    });
    let employers = await Promise.all(queryList).then((values) => {
      return values;
    });
    let jobs2 = jobs.map((job, index) => {
      job = { ...job._doc };
      job["employer"] = employers[index];
      return job;
    });
    return { code: 200, jobList: jobs2 };
  }
};

let getJobsOfOneEmployerById = async (empId) => {
  await JobModel.find(
    { empId: empId },
    "_id empId jobTitle jobDescription jobSalaryPerHour jobSalaryPerDay jobSalaryPerWeek jobSalaryAfterDone experienceRequired jobField jobStart jobEnd jobPublishDate jobStatus jobHeadCount",
    (err, docs) => {
      if (err) handleError(err);
      console.log(docs);
      return { code: 200, jobs: docs };
    }
  );
};

let jobPagination = async (pagination) => {
  let searchRegex = new RegExp(pagination.search, "i");
  let query = {
    $and: [
      {
        $or: [
          { jobTitle: { $regex: searchRegex } },
          { jobDescription: { $regex: searchRegex } },
        ],
        jobField: { $in: pagination.filter },
      },
    ],
  };

  let jobsWithConditions = await JobModel.find(
    query,
    "_id empId jobTitle jobDescription jobSalaryPerHour jobSalaryPerDay jobSalaryPerWeek jobSalaryAfterDone experienceRequired jobField jobStart jobEnd jobPublishDate jobStatus jobHeadCount",
    {
      skip: (pagination.pageNumber - 1) * pagination.pageSize,
      limit: pagination.pageNumber * pagination.pageSize,
    }
  ).populate("empId")
  .sort({
    jobTitle: pagination.sort,
  }).exec();
  console.log(jobsWithConditions);
  return { code: 200, jobs: jobsWithConditions };
};

let jobPaginationWithTime = async (pagination) => {
  let jobsWithConditions = await JobModel.find(
    {},
    "_id empId jobTitle jobSalaryAfterDone jobField jobStart jobEnd jobStatus jobHeadCountTarget",
    {
      skip: (pagination.pageNumber - 1) * pagination.pageSize,
      limit: pagination.pageNumber * pagination.pageSize,
    }
  ).populate("empId")
  .sort({
    jobPublishDate: pagination.sort,
  }).exec();
  console.log(jobsWithConditions);
  return { code: 200, job: jobsWithConditions };
};

let jobPaginationForWebAdmin = async (pagination) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  let searchRegex = new RegExp(pagination.search, "i");
  let match = {
    $match: {
      $or: [
        { jobTitle: { $regex: searchRegex } },
        { jobDescription: { $regex: searchRegex } },
        {
          empId: ObjectId.isValid(pagination.search)
            ? mongoose.Types.ObjectId(pagination.search)
            : "",
        },
      ],
    },
  };

  join = {
    $lookup: {
      from: "employers",
      localField: "empId",
      foreignField: "_id",
      as: "employer",
      // $project: "empEmail",
    },
  };

  let skip = {
    $skip: (pagination.pageNumber - 1) * pagination.pageSize,
  };
  let limit = {
    $limit: pagination.pageNumber * pagination.pageSize,
  };

  let sort;
  let jobsAndEmpWithCondition;
  if (pagination.sort) {
    sort = {
      $sort: { jobTitle: pagination.sort == "asc" ? 1 : -1 },
    };
    jobsAndEmpWithCondition = await JobModel.aggregate([
      match,
      join,
      skip,
      limit,
      sort,
      {
        $project: {
          _id: 1,
          jobTitle: 1,
          jobDescription: 1,
          jobStatus: 1,
          "employer._id": 1,
          "employer.empEmail": 1,
        },
      },
    ]);
  } else {
    jobsAndEmpWithCondition = await JobModel.aggregate([
      match,
      join,
      skip,
      limit,
      {
        $project: {
          _id: 1,
          jobTitle: 1,
          jobDescription: 1,
          jobStatus: 1,
          "employer._id": 1,
          "employer.empEmail": 1,
        },
      },
    ]);
  }
  // console.log(jobsAndEmpWithCondition);
  let jobCount = await JobModel.countDocuments({
    $or: [
      { jobTitle: { $regex: searchRegex } },
      { jobDescription: { $regex: searchRegex } },
      { createdBy: { $regex: searchRegex } },
    ],
  });

  await session.commitTransaction();
  session.endSession();
  // console.log(jobCount);
  let pageCount = Math.ceil(jobCount / 5);
  return { code: 200, jobs: jobsAndEmpWithCondition, pageCount };
};

let getJobDetail = async (job)=>{
  let jobDetail = await JobModel.find(
    {
    _id: job._id
  },
  {},
  ).populate("empId", "empName")
  .exec()
  .then(doc =>{
    return doc
  });
  if(jobDetail != null){
    return {code: GLOBAL.SUCCESS_CODE, jobDetail}
  }else{
    return{code: GLOBAL.NOT_FOUND_CODE, jobDetail: "Missing!"}
  }
}

module.exports = {
  createNewJob,
  getAllJobs,
  getAllJobsAndEmployerInfo,
  getJobsOfOneEmployerById,
  jobPagination,
  jobPaginationWithTime,
  FCM,
  jobPaginationForWebAdmin,
  getJobDetail,
  isFollowExisted,
};
