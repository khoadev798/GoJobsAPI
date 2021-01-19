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
    jobHeadCount, // default 1
  });
  let createNewJobResult = await jobService.createNewJob(newJob);
  console.log(createNewJobResult);
  res.status(createNewJobResult.code).send(createNewJobResult.message);
};

module.exports = {
  createNewJob,
};
