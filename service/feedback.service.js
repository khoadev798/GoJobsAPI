const mongoose = require("mongoose");
const GLOBAL = require("../global/global");
const Feedback = require("../model/feedback");
const FeedbackModel = mongoose.model("Feedback", Feedback);
const Freelancer = require("../model/freelancer");
const FreelancerModel = mongoose.model("Freelancer", Freelancer);
const Employer = require("../model/employer");
const EmployerModel = mongoose.model("Employer", Employer);

let empFeedbackCreate = async (empFeedback) => {
  empFeedback["createdAt"] = new Date();
  empFeedback["createdBy"] = empFeedback.empId;
  let empFeedbackInstance = new FeedbackModel(empFeedback);
  const session = await mongoose.startSession();
  session.startTransaction();
  await empFeedbackInstance.save({ session: session });
  let match = {
    $match: {
      flcId: mongoose.Types.ObjectId(empFeedback.flcId),
    },
  };

  let aggregate = {
    $group: {
      _id: { flcId: "$flcId" },
      totalRating: { $sum: "$starRating" },
      count: { $sum: 1 },
    },
  };

  let sumStarRating = await FeedbackModel.aggregate([
    match,
    aggregate,
  ]).session(session);
  console.log("sumStarRating: ", sumStarRating);
  const found = sumStarRating.find((rating) => rating.totalRating);
  const avg = sumStarRating.find((avg) => avg.count);
  const flcRating = found.totalRating / avg.count;

  let filter = {
    _id: empFeedback.flcId,
  };
  let update = {
    flcRating: flcRating,
  };
  const doc = await FreelancerModel.findOneAndUpdate(filter, update, {
    new: true,
  });
  await session.commitTransaction();
  session.endSession();
  console.log("Update thanh cong: ", doc);
  if (doc.length != 0) {
    return {
      code: GLOBAL.SUCCESS_CODE,
      message: "employer Tao feedback thanh cong",
    };
  } else {
    return {
      code: GLOBAL.NOT_FOUND_CODE,
      message: "employer Tao feedback that bai",
    };
  }
};

let flcFeedbackCreate = async (flcFeedback) => {
  flcFeedback["createdAt"] = new Date();
  flcFeedback["createdBy"] = flcFeedback.flcId;
  let flcFeedbackInstance = new FeedbackModel(flcFeedback);
  const session = await mongoose.startSession();
  session.startTransaction();
  await flcFeedbackInstance.save({ session: session });
  let match = {
    $match: {
      empId: mongoose.Types.ObjectId(flcFeedback.empId),
    },
  };

  let aggregate = {
    $group: {
      _id: { empId: "$empId" },
      totalRating: { $sum: "$starRating" },
      count: { $sum: 1 },
    },
  };

  let sumStarRating = await FeedbackModel.aggregate([
    match,
    aggregate,
  ]).session(session);
  console.log("sumStarRating: ", sumStarRating);
  const found = sumStarRating.find((rating) => rating.totalRating);
  const avg = sumStarRating.find((avg) => avg.count);
  const empRating = found.totalRating / avg.count;

  let filter = {
    _id: flcFeedback.empId,
  };
  let update = {
    empRating: empRating,
  };
  const doc = await EmployerModel.findOneAndUpdate(filter, update, {
    new: true,
  });
  await session.commitTransaction();
  session.endSession();
  console.log("Update thanh cong: ", doc);
  if (doc.length != 0) {
    return {
      code: GLOBAL.SUCCESS_CODE,
      message: "freelancer Tao feedback thanh cong",
    };
  } else {
    return {
      code: GLOBAL.NOT_FOUND_CODE,
      message: "freelancer Tao feedback that bai",
    };
  }
};

let getFeedbackByFlcId = async (feedback) =>{
  let found = await FeedbackModel.find(
    {
      $and: [
        {flcId: feedback.flcId},
        {createdBy: {$ne: feedback.flcId}}
      ]
    },
    "starRating",
    {
      skip: (feedback.pageNumber - 1) * feedback.pageSize,
      limit: feedback.pageNumber * feedback.pageSize,
  }
  ).populate("empId", "empName empLogo")
  .exec()
  .then(doc =>{
    return doc
  });
  if(found == undefined){
    return {code: GLOBAL.NOT_FOUND_CODE, feedbacks: "missing!"}
  }else{
    return {code: GLOBAL.SUCCESS_CODE, feedbacks: found}
  }
}

let getFeedbackByEmpId = async (feedback) =>{
  let found = await FeedbackModel.find(
    {
      $and: [
        {empId: feedback.empId},
        {createdBy: {$ne: feedback.empId}}
      ]
    },
    "starRating",
    {
      skip: (feedback.pageNumber - 1) * feedback.pageSize,
      limit: feedback.pageNumber * feedback.pageSize,
  }
  ).populate("flcId", "flcName flcAvatar")
  .exec()
  .then(doc =>{
    return doc
  });
  if(found == undefined){
    return {code: GLOBAL.NOT_FOUND_CODE, feedbacks: "missing!"}
  }else{
    return {code: GLOBAL.SUCCESS_CODE, feedbacks: found}
  }
}

module.exports = {
  empFeedbackCreate,
  flcFeedbackCreate,
  getFeedbackByFlcId,
  getFeedbackByEmpId
};
