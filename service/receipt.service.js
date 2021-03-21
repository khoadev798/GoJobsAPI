const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const GLOBAL = require("../global/global");
const Receipt = require("../model/receipt");
const Employer = require("../model/employer");
const Freelancer = require("../model/freelancer");
Receipt.plugin(mongoosePaginate);
const ReceiptModel = mongoose.model("Receipt", Receipt);
const EmployerModel = mongoose.model("Employer", Employer);
const FreelancerModel = mongoose.model("Freelancer", Freelancer);

let receiptPaginationForWebAdmin = async (pagination) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  let match = {
    $match: {
      $or: [
        { _id: mongoose.Types.ObjectId(pagination._id) },
        {
          createdAt: {
            $gte: new Date(pagination.from),
            $lt: new Date(pagination.to),
          },
        },
      ],
    },
  };

  let skip = {
    $skip: (pagination.pageNumber - 1) * pagination.pageSize,
  };
  let limit = {
    $limit: pagination.pageNumber * pagination.pageSize,
  };

  let sort;
  let receiptsWithCondition;
  if (pagination.sort) {
    sort = {
      $sort: { createdAt: pagination.sort == "asc" ? 1 : -1 },
    };
    receiptsWithCondition = await ReceiptModel.aggregate([
      match,
      skip,
      limit,
      sort,
    ]);
  } else {
    receiptsWithCondition = await ReceiptModel.aggregate([match, skip, limit]);
  }
  // console.log(receiptsWithCondition);
  let receiptCount = await ReceiptModel.countDocuments({
    $or: [
      { _id: mongoose.Types.ObjectId(pagination._id) },
      {
        createdAt: {
          $gte: new Date(pagination.from),
          $lt: new Date(pagination.to),
        },
      },
    ],
  });

  await session.commitTransaction();
  session.endSession();
  // console.log(receiptCount);
  let pageCount = Math.ceil(receiptCount / 5);
  return {
    code: 200,
    receipts: receiptsWithCondition,
    pageCount,
  };
};

let receiptInfoForWebAdmin = async (receipt1) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  let receiptQuery = await ReceiptModel.findById({ _id: receipt1._id });
  let receipt = receiptQuery._doc;
  let senderId = receipt.senderId;
  let receiverId = receipt.receiverId;
  if (senderId.includes("emp#")) {
    let employer = await EmployerModel.findById(
      {
        _id: mongoose.Types.ObjectId(
          senderId.substr(senderId.indexOf("#") + 1)
        ),
      },
      "empEmail"
    );
    receipt["senderEmail"] = employer.empEmail;
  } else if (senderId.includes("flc#")) {
    let freelancer = await FreelancerModel.findById(
      {
        _id: mongoose.Types.ObjectId(
          senderId.substr(senderId.indexOf("#") + 1)
        ),
      },
      "flcEmail"
    );
    receipt["senderEmail"] = freelancer.flcEmail;
  }

  if (receiverId.includes("emp#")) {
    let employer = await EmployerModel.findById(
      {
        _id: mongoose.Types.ObjectId(
          receiverId.substr(receiverId.indexOf("#") + 1)
        ),
      },
      "empEmail"
    );

    console.log(employer);
    receipt["receiverEmail"] = employer.empEmail;
  } else if (receiverId.includes("flc#")) {
    let freelancer = await FreelancerModel.findById(
      {
        _id: mongoose.Types.ObjectId(
          receiverId.substr(receiverId.indexOf("#") + 1)
        ),
      },
      "flcEmail"
    );
    receipt["receiverEmail"] = freelancer.flcEmail;
  }

  await session.commitTransaction();
  session.endSession();

  return { code: 200, receipt };
};

module.exports = { receiptPaginationForWebAdmin, receiptInfoForWebAdmin };
