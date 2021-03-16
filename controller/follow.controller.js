const followService = require("../service/follow.service");

let createFollow = async (req, res) =>{
    let {empId, flcId, tokenDeviceWithFlc} = req.query;

    let createFollowResult = await followService.createFollow({
        flcId,
        empId,
        tokenDeviceWithFlc,
    });
        res.status(createFollowResult.code).send(createFollowResult.message);
}

let delFollow = async (req, res) =>{
    let {empId, flcId} = req.query;

    let delFollowResult = await followService.delFollow({
        flcId,
        empId,
    });
    res.status(delFollowResult.code).send(delFollowResult.message);
}

let updateTokenWithFlcId = async (req, res) => {
    let {flcId, tokenDeviceWithFlc} = req.query;

    let updateTokenWithFlcIdResult = await followService.updateTokenWithFlcId({
        flcId,
        tokenDeviceWithFlc,
    });
    res.status(updateTokenWithFlcIdResult.code).send(updateTokenWithFlcIdResult.message);
}



module.exports = {
    createFollow,
    delFollow,
    updateTokenWithFlcId,
}