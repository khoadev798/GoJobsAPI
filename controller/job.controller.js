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
    jobSalary, // default: null
    jobStart, // required
    jobEnd, // required
    jobDuration, // default: null
    experienceRequired, // default: false
    jobPublishDate, // required
    jobStatus, // default "Opening"
    jobTotalSalaryPerHeadCount,
    jobHeadCountTarget, // default 1
    jobAddress,
  } = req.query;

  let newJob = infoValidation.removeUndefinedKeyValue({
    empId,
    jobField, // ("LDPT", "IT", "F&B",...)
    jobTitle, // required
    jobDescription, // required
    jobPaymentType, // ("Hourly", "Daily", "Weekly", "After-done"  ) // required
    jobSalary,
    jobStart, // required
    jobEnd, // required
    jobDuration, // default: null
    experienceRequired, // default: false
    jobPublishDate, // required
    jobStatus, // default "Opening"
    jobTotalSalaryPerHeadCount,
    jobHeadCountTarget, // default 1
    jobAddress,
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

const jobPagination = async (req, res) => {
  let { search, sort, filter, pageNumber, pageSize } = req.query;
  let pagingResult = await jobService.jobPagination({
    search,
    sort,
    filter,
    pageNumber,
    pageSize,
  });

  res.status(pagingResult.code).send(pagingResult.jobs);
};

const jobPaginationWithAddress = async (req, res) => {
  let { pageNumber, pageSize, search } = req.query;
  let paginnationWithAddressResult = await jobService.jobPaginationWithAddress({
    search,
    pageNumber,
    pageSize,
  });
  res
    .status(paginnationWithAddressResult.code)
    .send(paginnationWithAddressResult.jobs);
};

const jobPaginationWithTime = async (req, res) => {
  let { sort, pageNumber, pageSize } = req.query;
  let pagingResult = await jobService.jobPaginationWithTime({
    sort,
    pageNumber,
    pageSize,
  });
  console.log(pagingResult.code);

  res.status(pagingResult.code).send(pagingResult.job);
};

let getJobDetail = async (req, res) => {
  let { _id } = req.query;
  let getJobDetailResult = await jobService.getJobDetail({
    _id,
  });
  res.status(getJobDetailResult.code).send(getJobDetailResult.jobDetail);
};

let filForSearch = async (req, res) => {
  let filForSearchResult = await jobService.filForSearch();
  res.status(filForSearchResult.code).send(filForSearchResult.listField);
};

let deleteJobNotContract = async (req, res) =>{
  let {
    jobId
  } = req.query;

  let result = await jobService.deleteJobNotContract({jobId});
  res.status(result.code).send(result.message);
}

module.exports = {
  createNewJob,
  getAllJobs,
  getAllJobsOfEmployerById,
  getJobDetail,
  jobPagination,
  jobPaginationWithTime,
  jobPaginationWithAddress,
  filForSearch,
  deleteJobNotContract
};
