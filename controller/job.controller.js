const { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_LIFE } = require("../global/global");
const jwtHelper = require("../helpers/jwt.helper");
const infoValidation = require("../middleware/infoValidation.middle");
const jobService = require("../service/job.service");
const createNewJob = async (req, res) => {
  let {
    empId,
    jobField, // ("LDPT", "IT", "F&B",...)
    jobTitle, // required
    jobDescription, // required
    jobPaymentType, // ("Hourly", "Daily", "Weekly", "After-done"  ) // required
    jobSalaryPerHour, // default: null
    jobSalaryPerDay, // default: null
    jobSalaryPerWeek, // default: null
    jobSalaryAfterDone, // default: null
    jobStart, // required
    jobEnd, // required
    jobDuration, // default: null
    experienceRequired, // default: false
    jobPublishDate, // required
    jobStatus, // default "Opening"
    jobTotalSalaryPerHeadCount,
    jobHeadCount, // default 1
  } = req.body;

  let newJob = infoValidation.removeUndefinedKeyValue({
    empId,
    jobField, // ("LDPT", "IT", "F&B",...)
    jobTitle, // required
    jobDescription, // required
    jobPaymentType, // ("Hourly", "Daily", "Weekly", "After-done"  ) // required
    jobSalaryPerHour, // default: null
    jobSalaryPerDay, // default: null
    jobSalaryPerWeek, // default: null
    jobSalaryAfterDone, // default: null
    jobStart, // required
    jobEnd, // required
    jobDuration, // default: null
    experienceRequired, // default: false
    jobPublishDate, // required
    jobStatus, // default "Opening"
    jobTotalSalaryPerHeadCount,
    jobHeadCount, // default 1
  });
  let createNewJobResult = await jobService.createNewJob(newJob);
  console.log(createNewJobResult);
  res.status(createNewJobResult.code).send(createNewJobResult.message);
};

const getAllJobs = async (req, res) => {
  let jobsAPIResult = await jobService.getAllJobsAndEmployerInfo();
  res.status(jobsAPIResult.code).send(jobsAPIResult.jobList);
};

const getAllJobsOfEmployerById = async (req, res) => {
  let { empId } = req.query;
  let jobsOfEmpResult = await jobService.getJobsOfOneEmployerById(empId);
  res.status(jobsOfEmpResult.code).send(jobsOfEmpResult.jobs);
};

const getAllJobTypes = async (req, res) => {
  let jobTypesResult = await jobService.getAllJobTypes();
  res.status(jobTypesResult.code).send(jobTypesResult.jobTypes);
};

const jobPagination = async (req, res) => {
  let { search, sort, filter, pageNumber, pageSize } = req.query;
  console.log(filter);
  let pagingResult = await jobService.jobPagination({
    search,
    sort,
    filter,
    pageNumber,
    pageSize,
  });

  res.status(pagingResult.code).send(pagingResult.jobs);
};

module.exports = {
  createNewJob,
  getAllJobs,
  getAllJobsOfEmployerById,
  getAllJobTypes,
  jobPagination,
};
