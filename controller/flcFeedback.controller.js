const flcFeedbackService = require("../service/flcFeedback.service");

let createFlcFeedback = async (req, res) => {
  let { empId, jobId, flcId, empComment, starRating } = req.query;
  let flcFeedbackCreateResult = await flcFeedbackService.flcFeedbackCreate({
    empId,
    jobId,
    flcId,
    empComment,
    starRating
  });
  res
    .status(flcFeedbackCreateResult.code)
    .send(flcFeedbackCreateResult.message);
};

let flcFeedbackAVG = async (req, res) =>{
  let {flcId} = req.body;
  let flcFeedbackAVGResult = await flcFeedbackService.flcFeedbackAVG({flcId});
  if(flcFeedbackAVGResult.code ==200) {
    res.status(flcFeedbackAVGResult.code).send({
      flcFeedbacks: flcFeedbackAVGResult.flcFeedbacks
    });
  }
}


module.exports = {
  createFlcFeedback,
  flcFeedbackAVG
};
