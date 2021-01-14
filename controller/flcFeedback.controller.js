const flcFeedbackService = require("../service/flcFeedback.service");

let createFlcFeedback = async (req, res) => {
  let { freelancer_id, job_id, em_id } = req.body;
  console.log("new flcFeedback: ");
  let flcFeedbackCreateResult = await flcFeedbackService.flcFeedbackCreate({
    freelancer_id,
    job_id,
    em_id,
  });
  res
    .status(flcFeedbackCreateResult.code)
    .send(flcFeedbackCreateResult.message);
};

let getAllFlcFeedback = async (req, res) => {
  let flcFeedbackList = await flcFeedbackService.getAllFlcFeedback();
  res.status(200).send(flcFeedbackList);
};

// let updateFreelancer = async (req, res) =>{
//     let { flcFeedbackId, newFlcFeedback } = req.body;
//     console.log("Update freelancer feedback", flcFeedbackId);
//     let flcFeedbackUpdateResult = await flcFeedbackService.flcFeedbackUpdate({
//         flcFeedbackId,
//         newFlcFeedback,
//     });
//     res.status(flcFeedbackUpdateResult.code).send(flcFeedbackUpdateResult.message);
// };

// let deleteFlcFeedback = (req, res) =>{};

module.exports = {
  createFlcFeedback,
  // updateFreelancer,
  getAllFlcFeedback,
  // deleteFlcFeedback,
};
