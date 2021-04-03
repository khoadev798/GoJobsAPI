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
    await NotificationModel.find({
        $and: [
            {
                flcId: {
                    $elemMatch: {
                        $eq: mongoose.Types.ObjectId(notification.flcId),
                    }
                }
            },
            { createdBy: "Employer" }
        ]
    },
        "jobId empId",
        {
            skip: (notification.pageNumber - 1) * notification.pageSize,
            limit: notification.pageNumber * notification.pageSize,
        }
    ).populate("empId", "empName")
        .exec()
        .then(doc => {
            notifi = [...doc]
            console.log(doc);
        });
    await session.commitTransaction();
    session.endSession();

    // }
    return { code: GLOBAL.SUCCESS_CODE, message: "get notification success!", notifi }
}

let getNotificationForEmp = async (notification) => {
    // let isFollowExisted = await findFlcFollowEmp(notification);
    const session = await mongoose.startSession();
    session.startTransaction();
    let notifi;
    // console.log(isFollowExisted.follow);
    // if (isFollowExisted.code == 200) {
    await NotificationModel.find({
        $and: [
            {
                empId: notification.empId
            },
            { createdBy: "Freelancer" }
        ]
    },
        "jobId",
        {
            skip: (notification.pageNumber - 1) * notification.pageSize,
            limit: notification.pageNumber * notification.pageSize,
        }
    ).populate("jobId")
        .exec()
        .then(doc => {
            notifi = [...doc]
            console.log(doc);
        });
    await session.commitTransaction();
    session.endSession();

    // }
    return { code: GLOBAL.SUCCESS_CODE, message: "get notification success!", notifi }
}

module.exports = {
    getNotification,
    getNotificationForEmp
}
