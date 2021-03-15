const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const GLOBAL = require("../global/global");
const Job = require("../model/job");
Job.plugin(mongoosePaginate);
const Employer = require("../model/employer");
const JobModel = mongoose.model("Job", Job);
const EmployerModel = mongoose.model("Employer", Employer);
const util = require("../util/data.util");
const admin = require("firebase-admin");

const serviceAccount = require("../privatefile.json");

let createNewJob = async (job) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  job["jobPublishDate"] = new Date();
  let jobInstance = new JobModel(job);
  await jobInstance.save({ session: session });

  if (!admin.apps.length) {

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://console.firebase.google.com/u/1/project/gojobs-7d2ee/overview"
    });
  } else {
    admin.app(); // if already initialized, use that one
  }

  let token = ['fRB4I1ccR3WTtuGwxdXN2E:APA91bGvguOHXiiQsmXp9Wh5FfvoQYjyuY-BTTNuXRdRSd0lhx_xEEzpYcl8sY8hjJ3S-ZYWZRCF8ip0Nw5rAob-hF8VpXOe1pUTQ7tJZFYqdaRCFVlf--7660DP5JrSzmxDHK5lEIQ9'];

  const payload = {
    notification: {
      title: "New Job",
      body: jobInstance.jobDescription
    }
  };

  const options = {
    priority: "high",
    timeToLive: 60 * 60 * 24
  };

  admin.messaging().sendToDevice(token, payload, options)
    .then((res) => console.log("Successfully send notify:", res))
    .catch((err) => console.log("Error:", err));
  console.log("new jobs: ", jobInstance);
  await session.commitTransaction();
  session.endSession();
  return { code: GLOBAL.SUCCESS_CODE, message: "Tao job moi thanh cong"};
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
