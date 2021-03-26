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
            flcId: {
                $elemMatch: {
                    $eq: mongoose.Types.ObjectId(notification.flcId) ,
                }
            }
        },
        "jobId empId"
        ).populate("empId", "empName")
        .exec()
        .then(doc =>{
            notifi = [...doc]
            console.log(doc);
        });
        await session.commitTransaction();
        session.endSession();
        
    // }
     return {code:GLOBAL.SUCCESS_CODE, message: "get notification success!", notifi}
}

module.exports = {
    getNotification,
}
