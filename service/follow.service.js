const mongoose = require("mongoose");
const GLOBAL = require("../global/global");
const Follow = require("../model/follow");
const FollowModel = mongoose.model("Follow", Follow);

let createFollow = async (follow) =>{
    follow["createdAt"] = new Date();
    let followInstance = new FollowModel(follow);
    await followInstance.save((err, doc) =>{
        if(err) return handlerError(err);
        console.log("follow: " , doc);
    });
    
    return {code: GLOBAL.SUCCESS_CODE, message: "created follow"}
}

let delFollow = async (follow) =>{
    let filter = {
        $and: [
            { empId: follow.empId},
            { flcId: follow.flcId}
        ]
    }

    await FollowModel.findOneAndDelete(filter, (err) =>{
        if(err) return handlerError(err);

    });
    return {code: GLOBAL.SUCCESS_CODE, message: "delete Follow success!"};
};

let updateTokenWithFlcId = async (follow) =>{
    let filter = {
        $and: [
            {flcId: follow.flcId},
            {tokenDeviceWithFlc: { $ne: follow.tokenDeviceWithFlc}},
        ]
    }
    await FollowModel.updateMany(
        filter,
        { $push: {tokenDeviceWithFlc: follow.tokenDeviceWithFlc}},
        (err, docs) => {
            if(err) return handlerError(err);
            console.log("updated: ", docs);
        });
       return {code: GLOBAL.SUCCESS_CODE, message: "updated success!"}; 
}


module.exports = {
    createFollow,
    delFollow,
    updateTokenWithFlcId
}