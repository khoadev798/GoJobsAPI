const mongoose = require("mongoose");
const GLOBAL = require("../global/global");
const Notification = require("../model/notification");
const NotificationModel = mongoose.model("Notification", Notification);
const Follow = require("../model/follow");
const FollowModel = mongoose.model("Follow", Follow);

let getNotification = async (notification) => {
  // let isFollowExisted = await findFlcFollowEmp(notification);
  const session = await mongoose.startSession();
  session.startTransaction();
  let notifi;
  // console.log(isFollowExisted.follow);
  // if (isFollowExisted.code == 200) {
  await NotificationModel.find(
    {
      $and: [
        {
          flcId: {
            $elemMatch: {
              $eq: mongoose.Types.ObjectId(notification.flcId),
            },
          },
        },
        { createdBy: "Employer" },
      ],
    },
    "jobId empId content",
    {
      skip: (notification.pageNumber - 1) * notification.pageSize,
      limit: notification.pageNumber * notification.pageSize,
    }
  )
    .populate("jobId", "jobTitle jobTotalSalaryPerHeadCount")
    .sort({ createdAt: notification.sort })
    .exec()
    .then((doc) => {
      notifi = [...doc];
      console.log(doc);
    });
  await session.commitTransaction();
  session.endSession();

  // }
  return {
    code: GLOBAL.SUCCESS_CODE,
    message: "get notification success!",
    notifi,
  };
};

let getNotificationForEmp = async (notification) => {
  // let isFollowExisted = await findFlcFollowEmp(notification);
  const session = await mongoose.startSession();
  session.startTransaction();
  let notifi = await NotificationModel.find(
    {
      $and: [
        {
          empId: notification.empId,
        },
        { createdBy: "Freelancer" },
      ],
    },
    " content jobId",
    {
      skip: (notification.pageNumber - 1) * notification.pageSize,
      limit: notification.pageNumber * notification.pageSize,
    }
  )
    .populate("jobId", "jobId")
    .sort({ createdAt: notification.sort })
    .exec();

  await session.commitTransaction();
  session.endSession();

  if (notifi.length != 0) {
    return { code: GLOBAL.SUCCESS_CODE, notifi };
  } else {
    return { code: GLOBAL.NOT_FOUND_CODE, notifi: "missing!" };
  }
};

module.exports = {
  getNotification,
  getNotificationForEmp,
};
