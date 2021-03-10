const mongoose = require("mongoose");
const GLOBAL = require("../global/global");
const EmpFeedback = require("../model/empFeedback");
const EmpFeedbackModel = mongoose.model("EmpFeedback", EmpFeedback);

let empFeedbackCreate = async (empFeedback) => {
    empFeedback["createdAt"] = new Date();
    let empFeedbackInstance = new EmpFeedbackModel(empFeedback);
    
    empFeedbackInstance.save((err, obj) =>{
        if(err) return handleError(err);
    });
    return { code: GLOBAL.SUCCESS_CODE, message: "Tao thanh cong!"};
};

let empFeedbackAVG = async (empFeedback) => {
    const isEmpFeedbackExisted = await findEmpFeedbackById(empFeedback);
    console.log(isEmpFeedbackExisted.code);
    console.log("empId " + isEmpFeedbackExisted.empId)
    if (isEmpFeedbackExisted.code == 200) {
        let empFeedbacks = [];
       
        await EmpFeedbackModel.find(
            {empId: isEmpFeedbackExisted.empFeedback.empId},
            (err, docs) =>{
                if (err) return handleError(err);
                console.log("te: " + docs)
            }
        );
        if (empFeedbacks.length != 0) {
            return {code: GLOBAL.SUCCESS_CODE, empFeedbacks};
        } else {
            return {code: GLOBAL.NOT_FOUND_CODE, empFeedbacks: "Missing"};
        }
    }
}

let findEmpFeedbackById = async (empFeedback) =>{
    console.log("empId: " + empFeedback.empId)
    let found = await EmpFeedbackModel.findOne(
        {empId: empFeedback.empId},
        (err, doc) =>{
            if(err) return handleError(err);
            return doc;
        });
        if(found == undefined) {
            return {
                code: GLOBAL.NOT_FOUND_CODE,
                message: "Employer Feedback not found!",
            };
        } else {
            return {
                code: GLOBAL.SUCCESS_CODE,
                message: "Employer Feedback Existesd!",
                empFeedback: found,
            }
        }
}

module.exports = {
    empFeedbackCreate,
    empFeedbackAVG
}