const empFeedbackService = require("../service/empFeedback.service");

let createEmpFeedback = async (req, res) =>{
    let {
        jobId,
         empId, 
         flcId, 
         starRating,
         flcComment
        } = req.query;
       let createEmpFeedbackResult = await empFeedbackService.empFeedbackCreate({
           jobId,
           empId,
           flcId,
           starRating,
            flcComment,
       });
       res.status(createEmpFeedbackResult.code).send(createEmpFeedbackResult.message);
}

let empFeedbackAVG = async (req, res) => {
    let {empId} = req.body;
    console.log("empId: " + empId);
    let empFeedbackAVGResult = await empFeedbackService.empFeedbackAVG({
        empId,
    });
     if (empFeedbackAVGResult.code == 200){
         res.status(empFeedbackAVGResult.code).send({
             empFeedbacks: empFeedbackAVGResult.empFeedbacks,
         });
     } 
}

module.exports = {
    createEmpFeedback,
    empFeedbackAVG,
}