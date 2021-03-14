const mongoose = require("mongoose");
const GLOBAL = require("../global/global");
const FlcFeedback = require("../model/flcFeedback");
const FlcFeedbackModel = mongoose.model("FlcFeedback", FlcFeedback);
const Freelancer = require("../model/freelancer");
const FreelancerModel = mongoose.model("Freelancer", Freelancer);

let flcFeedbackCreate = async (flcFeedback) => {
    flcFeedback["createdAt"] = new Date();
    let flcFeedbackInstance = new FlcFeedbackModel(flcFeedback);
    const session = await mongoose.startSession();
     session.startTransaction();
    await flcFeedbackInstance.save({ session: session });
    let match = {
        $match: {
            flcId:mongoose.Types.ObjectId(flcFeedback.flcId),
        }
    }

    let aggregate = {
        $group: {
            _id: {flcId: "$flcId"},
           totalRating: { $sum: "$starRating"},
           count: {$sum: 1}
        }
    }

    let sumStarRating = await FlcFeedbackModel.aggregate([match,aggregate]).session(session);
    console.log("sumStarRating: ", sumStarRating);
       const found = sumStarRating.find(rating=> rating.totalRating);
       const avg = sumStarRating.find(avg=> avg.count);
       const flcRating = found.totalRating / avg.count;

       let filter = {
           _id: flcFeedback.flcId,
       }
       let update = {
           flcRating: flcRating,
       }
       const doc = await FreelancerModel.findOneAndUpdate(filter, update, {
           new: true,
       });
       await session.commitTransaction();
       session.endSession();
       console.log("Update thanh cong: ", doc)
       if( doc.length !=0){
           return { code: GLOBAL.SUCCESS_CODE, message: "Tao feedback freelancer thanh cong"};
       }else{
           return { code: GLOBAL.NOT_FOUND_CODE, message: "Tao feedback freelancer that bai"};
       }
};


module.exports = {
    flcFeedbackCreate,
    getAllFlcFeedback,
    flcFeedbackAVG,
}