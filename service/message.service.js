const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const GLOBAL = require("../global/global");
const Message = require("../model/message");
const MessageModel = mongoose.model("Message", Message);

let createMessage = async (message) => {
    message["createdAt"] = new Date();
    let messageInstance = new MessageModel(message);
    await messageInstance.save((err, doc) =>{
        if (err) return handlerError(err);
        return {code: GLOBAL.SUCCESS_CODE, message:"create message thanh cong!", doc}
    })
};

