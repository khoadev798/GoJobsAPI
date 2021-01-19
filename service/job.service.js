const mongoose = require("mongoose");
const GLOBAL = require("../global/global");
const Job = require("../model/job");
const JobModel = mongoose.model("Job", Job);
const util = require("../util/data.util");

let createNewJob = async (job) => {
  job["jobPublishDate"] = new Date();
  let jobInstance = new JobModel(job);
  await jobInstance.save((err, obj) => {
    if (err) throw err;
  });
  return { code: 200, message: "Tao cong viec thanh cong" };
};

module.exports = {
  createNewJob,
};
