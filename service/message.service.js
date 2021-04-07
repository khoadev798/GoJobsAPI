const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const GLOBAL = require("../global/global");
const Message = require("../model/message");
const MessageModel = mongoose.model("Message", Message);
const Freelancer = require("../model/freelancer");
const FreelancerModel = mongoose.model("Freelancer", Freelancer);
const fcm = require("fcm-notification");
const path = require("path");
const jobService = require("../service/job.service");
//  const FCM = fcm(path.join(__dirname, "../privatefile.json"));

let newMessage = async (message) => {
    let isMessageExisted = await findMessageByUserId(message);
    const session = await mongoose.startSession();
    session.startTransaction();
    if (isMessageExisted.code == 404) {
        message["createdAt"] = new Date();
        let messageInstance = new MessageModel(message);
        await messageInstance.save();
    } else if (isMessageExisted.code == 200 && message.content != undefined && message.content != []) {
        let filter = {
            $and: [
                { flcId: isMessageExisted.chat.flcId },
                { empId: isMessageExisted.chat.empId }
            ]
        }
        console.log("content service ",message.content);
        await MessageModel.findOneAndUpdate(
            filter,
            { $addToSet: { content: message.content } },
            (err, doc) => {
                console.log("updated: ", doc);
            }
        );
    }
    if(message.content == undefined){
        console.log("No content!");
    }else{
        if (message.empId == message.content[0].userId) {
            let flcTokenDevices;
            await MessageModel.findOne({
                flcId: message.flcId
            },
                "flcId"
            ).populate("flcId", "flcTokenDevice")
                .exec()
                .then(doc => {
                    flcTokenDevices = { ...doc };
                });
            var message = {
                data: {
                    score: '850',
                    time: '2:45'
                },
                notification: {
                    title: 'GoJobs',
                    body: 'Test message by Cậu Huy'
                }
            };
            jobService.FCM.sendToMultipleToken(message, flcTokenDevices._doc.flcId.flcTokenDevice, (err, response) => {
                if (err) {
                    console.log("err--", err);
                } else {
                    console.log("response------", response)
                }
            })
        } else if ( message.flcId == message.content[0].userId) {
            let empTokenDevices;
            await MessageModel.findOne({
                empId: message.empId
            },
                "empId"
            ).populate("empId", "empTokenDevice")
                .exec()
                .then(doc => {
                    empTokenDevices = { ...doc };
                });
            var message = {
                data: {
                    score: '850',
                    time: '2:45'
                },
                notification: {
                    title: 'GoJobs',
                    body: 'Test message by Cậu Huy'
                }
            };
            jobService.FCM.sendToMultipleToken(message, empTokenDevices._doc.empId.empTokenDevice, (err, response) => {
                if (err) {
                    console.log("err--", err);
                } else {
                    console.log("response------", response)
                }
            })
    
        }
    }
    
    let findMessageResult = await findMessageByUserId(message);
    await session.commitTransaction();
    session.endSession();

    return { code: GLOBAL.SUCCESS_CODE, message: "new message success!", messages: findMessageResult.chat };
}


let findMessageByUserId = async (message) => {
    let found = await MessageModel.findOne(
        {
            $and: [
                { empId: message.empId },
                { flcId: message.flcId },
            ]
        },
        {},
        (err, doc) => {
            if (err) handlerError(err);
            return doc;
        }
    );
    if (found == undefined) {
        return {
            code: GLOBAL.NOT_FOUND_CODE,
            message: "Message not found!",
        };
    } else {
        return {
            code: GLOBAL.SUCCESS_CODE,
            message: "find success!",
            chat: found,
        }
    }
}
let findMessageByUserIdOr = async (message) => {
    let found = await MessageModel.findOne(
        {
            $or: [
                { empId: message.empId },
                { flcId: message.flcId },
            ]
        },
        {},
        (err, doc) => {
            if (err) handlerError(err);
            return doc;
        }
    );
    if (found == undefined) {
        return {
            code: GLOBAL.NOT_FOUND_CODE,
            message: "Message not found!",
        };
    } else {
        return {
            code: GLOBAL.SUCCESS_CODE,
            message: "find success!",
            chat: found,
        }
    }
}


let getNotificationMessageByFlc = async (message) => {
   let isMessageExisted = await findMessageByUserIdOr(message);
   let listNotification = [];
   if(isMessageExisted.code==200 ){
        
        await MessageModel.find({
            flcId: message.flcId
        },
        "content",
        {
            skip: (message.pageNumber - 1) * message.pageSize,
            limit: message.pageNumber * message.pageSize,
        }
        ).populate("empId", "empName")
        .exec()
        .then(doc =>{
            listNotification = [...doc]
            console.log(doc);
        })
    }
    if (listNotification.length != 0) {
        return { code: GLOBAL.SUCCESS_CODE, listNotification };
    } else {
        return { code: GLOBAL.NOT_FOUND_CODE, listNotification: "Missing!" };
    }
}

let getNotificationMessageByEmp = async (message) => {
    let listNotification = [];
         
         await MessageModel.find({
             empId: message.empId
         },
         "content",
         {
            skip: (message.pageNumber - 1) * message.pageSize,
            limit: message.pageNumber * message.pageSize,
        }
         ).populate("flcId", "flcName flcAvatar")
         .exec()
         .then(doc =>{
             listNotification = [...doc]
             console.log(listNotification);
         })
 
     
     if (listNotification.length != 0) {
         return { code: GLOBAL.SUCCESS_CODE, listNotification };
     } else {
         return { code: GLOBAL.NOT_FOUND_CODE, listNotification: "Missing!" };
     }
 }

 let getMessageDetail = async (message) =>{
     let messageDetail = await MessageModel.findOne(
         {_id: message._id},
         "content",
         {
            skip: (message.pageNumber - 1) * message.pageSize,
            limit: message.pageNumber * message.pageSize,
        }
     ).populate("empId flcId", "empName flcName")
     .exec()
     .then(doc =>{
         return doc;
     });
     if(messageDetail != null){
         return {code: GLOBAL.SUCCESS_CODE, messageDetail};
     }else{
         return {code: GLOBAL.NOT_FOUND_CODE, messageDetail: "Missing!"}
     }
 }


module.exports = {
    newMessage,
    getNotificationMessageByEmp,
    getNotificationMessageByFlc,
    getMessageDetail,
}

