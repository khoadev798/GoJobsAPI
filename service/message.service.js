const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const GLOBAL = require("../global/global");
const Message = require("../model/message");
const MessageModel = mongoose.model("Message", Message);

let newMessage = async (message) => {
    let isMessageExisted = await findMessageByUserId(message);
    if (isMessageExisted.code == 404) {
        message["createdAt"] = new Date();
        let messageInstance = new MessageModel(message);
        await messageInstance.save((err, doc) => {
            if (err) return handlerError(err);
            return console.log(doc);
        });
    } else if (isMessageExisted.code == 200) {
        let filter = {
            $and: [
                { flcId: isMessageExisted.chat.flcId },
                { empId: isMessageExisted.chat.empId }
            ]
        }
        await MessageModel.findOneAndUpdate(
            filter,
            { $push: { content: message.content } },
            (err, doc) => {
                if (err) return handlerError(err);
                console.log("updated: ", doc);
            }
        );
    }
    return {code: GLOBAL.SUCCESS_CODE, message: "new message success!"};
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

module.exports = {
    newMessage,
}

