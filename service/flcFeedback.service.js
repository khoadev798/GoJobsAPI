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
    let isFlcFeedbackExisted = await findFlcFeedbackById(flcFeedback);
    if (isFlcFeedbackExisted.code == 404) {
        
        let flcFeedbackInstance = new FlcFeedbackModel(flcFeedback);
        flcFeedbackInstance.save((err, obj) =>{
            if(err) return handleError(err);
        });
        return { code: 200, message: "Tao thanh cong!"};
    }else {
        return { code: 409, message: "Freelancer Feedback da ton tai!"};
    }
};

let flcFeedbackUpdate = async (flcFeedback) => {
    let isFlcFeedbackExisted = await findFlcFeedbackById(flcFeedback);

    if (isFlcFeedbackExisted.code == 404){
        return { code: 404, message: "freelancer feedback khong ton tai"};
    } else{
        let filter = {
            flcFeedback_id: flcFeedback._id,
        };
        let update = {
            flcFeedback_id: flcFeedback.newFlcFeedback_id,
            updatedAt: new Date(),
        };
        let doc = await FlcFeedbackModel.findOneAndUpdate(filter, update, {
            new: true,
        });
        if(doc) {
            return {
                code: GLOBAL.SUCCESS_CODE,
                message: "Freelancer feedback da duoc cap nhat!",
            };
        }
    }
};

let findFlcFeedbackById = async (flcFeedback) =>{
    let found; 
    await FlcFeedbackModel.findOne(
        {_id: flcFeedback._id},
        (err, flcFeedback1) =>{
            if(err) return handleError(err);
            if (flcFeedback1) {
                found = { ...flcFeedback1._doc};
            }
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
    flcFeedbackUpdate,
}