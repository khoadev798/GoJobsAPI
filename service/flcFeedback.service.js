const mongoose = require("mongoose");
const GLOBAL = require("../global/global");
const FlcFeedback = require("../model/flcFeedback");
const FlcFeedbackModel = mongoose.model("FlcFeedback", FlcFeedback);

let getAllFlcFeedback = async () =>{
    await FlcFeedbackModel.find({}, "_id flcEmail", (err, docs) =>{
        if(err) return handleError(err);
        console.log(docs);
        return "OK";
    });
};

let flcFeedbackCreate = async (flcFeedback) =>{
    flcFeedback["createdAt"] = new Date();
        let flcFeedbackInstance = new FlcFeedbackModel(flcFeedback);
        
        flcFeedbackInstance.save((err, obj) =>{
            if(err) return handleError(err);
        });
        return { code: GLOBAL.SUCCESS_CODE, message: "Tạo feedback freelancer thành công"};
};

let flcFeedbackAVG = async (flcFeedback) =>{
    const isFlcFeedbackExisted = await findFlcFeedbackById(flcFeedback);
    console.log("flcId: " + isFlcFeedbackExisted.flcId)
    if (isFlcFeedbackExisted.code == 200) {
        let flcFeedbacks = [];

        await FlcFeedbackModel.find(
            {flcId: isFlcFeedbackExisted.flcFeedback.flcId},
            (err, docs) =>{
                if (err) return handleError(err);
                flcFeedbacks = [...docs];
            }
        );
        if (flcFeedbacks.length !=0){
            return {code: GLOBAL.SUCCESS_CODE, flcFeedbacks};
        } else {
            return {code: GLOBAL.NOT_FOUND_CODE, flcFeedbacks: "Missing!"};
        }
    }
}

let findFlcFeedbackById = async (flcFeedback) =>{
    let found = await FlcFeedbackModel.findOne(
        {flcId: flcFeedback.flcId},
        (err, flcFeedback1) =>{
            if(err) return handleError(err);
           return flcFeedback1
        }
    );
    if(found == undefined) {
        return {
            code: GLOBAL.NOT_FOUND_CODE,
            message: "Freelancer Feedback not found!",
        };
    } else {
        return{
            code: GLOBAL.SUCCESS_CODE,
            message: "Freelancer Feedback Existed!",
            flcFeedback: found,
        };
    }
};

module.exports = {
    flcFeedbackCreate,
    getAllFlcFeedback,
    flcFeedbackAVG,
}