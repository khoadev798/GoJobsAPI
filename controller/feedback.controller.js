const feedbackService = require("../service/feedback.service");

let createEmpFeedback = async (req, res) => {
  let { empId, jobId, flcId, comment, starRating } = req.query;
  console.log(starRating);
  let empFeedbackCreateResult = await feedbackService.empFeedbackCreate({
    empId,
    jobId,
    flcId,
    comment,
    starRating,
  });
  res
    .status(empFeedbackCreateResult.code)
    .send(empFeedbackCreateResult.message);
};

let createFlcFeedback = async (req, res) => {
  let { empId, jobId, flcId, comment, starRating } = req.query;
  let flcFeedbackCreateResult = await feedbackService.flcFeedbackCreate({
    empId,
    jobId,
    flcId,
    comment,
    starRating,
  });
  res
    .status(flcFeedbackCreateResult.code)
    .send(flcFeedbackCreateResult.message);
};

let getFeedbackByFlcId = async (req, res) => {
  let { flcId, pageNumber, pageSize } = req.query;
  let getFeedbackByFlcIdResult = await feedbackService.getFeedbackByFlcId({
    flcId,
    pageNumber,
    pageSize,
  });
  res
    .status(getFeedbackByFlcIdResult.code)
    .send(getFeedbackByFlcIdResult.feedbacks);
};

let getFeedbackByEmpId = async (req, res) => {
  let { empId, pageNumber, pageSize } = req.query;
  let getFeedbackByEmpIdResult = await feedbackService.getFeedbackByEmpId({
    empId,
    pageNumber,
    pageSize,
  });
  res
    .status(getFeedbackByEmpIdResult.code)
    .send(getFeedbackByEmpIdResult.feedbacks);
};

let checkFlcCreatedFeedback = async (req, res) =>{
  let {jobId, flcId} = req.query;
  let result = await feedbackService.checkFlcCreatedFeedback({
    jobId,
    flcId
  });
  res.status(result.code).send(result.message);
}

module.exports = {
  createEmpFeedback,
  createFlcFeedback,
  getFeedbackByFlcId,
  getFeedbackByEmpId,
  checkFlcCreatedFeedback
};
