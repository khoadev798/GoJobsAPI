const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const GLOBAL = require("../global/global");
const Job = require("../model/job");
Job.plugin(mongoosePaginate);
const Employer = require("../model/employer");
const JobModel = mongoose.model("Job", Job);
const EmployerModel = mongoose.model("Employer", Employer);
const Follow = require("../model/follow");
const FollowModel = mongoose.model("Follow", Follow);
const util = require("../util/data.util");
const admin = require("firebase-admin");
const path = require("path");
const fcm = require("fcm-notification");
const FCM = new fcm(path.join(__dirname, "../privatefile.json"));
const Notification = require("../model/notification");
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
      Tokens = Tokens.concat(token.tokenDeviceWithFlc);
      flcIds = flcIds.concat(token.flcId);
    });
    let endTokens = await Promise.all(Tokens).then((values) => {
      return values;
    });
    let endFlcIds = await Promise.all(flcIds).then((values) => {
      return values;
    });

    let notification = {
      flcId: endFlcIds,
      jobId: jobInstance._id,
      createdAt: new Date(),
    };
    let notificationInstance = new NotificationModel(notification);
    await notificationInstance.save(notification, (err, doc) => {
      if (err) handleError(err);
      return console.log(doc);
    });

    console.log("toekn:", tokenlists);
    // var message = {
    //   data: {
    //     score: '850',
    //     time: '2:45'
    //   },
    //   notification:{
    //     title : 'Navish',
    //     body : 'Test message by navish'
    //   }
    // };
    // FCM.sendToMultipleToken(message, endTokens, function(err, response) {
    //     if(err){
    //         console.log('err--', err);
    //     }else {
    //         console.log('response-----', response);
    //     }

    // })
  }

  console.log("new jobs: ", jobInstance);
  await session.commitTransaction();
  session.endSession();
  return { code: GLOBAL.SUCCESS_CODE, message: "Tao job moi thanh cong" };
};

let isFollowExisted = async (job) => {
  let found = await FollowModel.find(
    { empId: job.empId },
    "tokenDeviceWithFlc flcId",
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

let getAllJobTypes = async () => {
  let jobTypes = await JobModel.aggregate([
    {
      $group: {
        _id: { jobField: "$jobField" },
        count: { $sum: 1 },
      },
    },
  ]);
  return { code: 200, jobTypes: jobTypes };
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
  ).sort({
    jobTitle: pagination.sort,
  });
  console.log(jobsWithConditions);
  return { code: 200, jobs: jobsWithConditions };
};

let jobPaginationWithTime = async (pagination) => {
  let jobsWithConditions = await JobModel.find(
    {},
    "_id empId jobTitle jobDescription jobSalaryPerHour jobSalaryPerDay jobSalaryPerWeek jobSalaryAfterDone experienceRequired jobField jobStart jobEnd jobPublishDate jobStatus jobHeadCount",
    {
      skip: (pagination.pageNumber - 1) * pagination.pageSize,
      limit: pagination.pageNumber * pagination.pageSize,
    }
  ).sort({
    jobPublishDate: pagination.sort,
  });
  console.log(jobsWithConditions);
  return { code: 200, jobs: jobsWithConditions };
};

module.exports = {
  createNewJob,
  getAllJobs,
  getAllJobsAndEmployerInfo,
  getJobsOfOneEmployerById,
  getAllJobTypes,
  jobPagination,
  jobPaginationWithTime,
};
