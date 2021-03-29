const followService = require("../service/follow.service");

let createFlcFollowEmp = async (req, res) =>{
    let {empId, flcId} = req.query;

    let createFollowResult = await followService.createFlcFollowEmp({
        flcId,
        empId,
        
    });
        res.status(createFollowResult.code).send(createFollowResult.message);
}

let createEmpFollowFlc = async (req, res) =>{
    let {empId, flcId} = req.query;
    let createEmpFollowFlcResult = await followService.createEmpFollowFlc({
        flcId,
        empId,
    });
    res.status(createEmpFollowFlcResult.code).send(createEmpFollowFlcResult.message);
}

let createFlcFollowJob = async(req, res) =>{
    let {flcId, jobId} = req.query;
    let createFlcFollowJobResult = await followService.createFlcFollowJob({
        flcId,
        jobId
    });
    res.status(createFlcFollowJobResult.code).send(createFlcFollowJobResult.message);
}

let getFlcByEmpFollow = async (req, res )=>{
    let { empId} = req.query;
    let getFlcByEmpFollowResult = await followService.getFlcByEmpFollow({

        empId
    });
    res.status(getFlcByEmpFollowResult.code).send(getFlcByEmpFollowResult.freelancers);
}

let getJobByFlcFollow = async (req, res) =>{
    let {flcId} = req.query;
    let getJobByFlcFollowResult = await followService.getJobByFlcFollow({
        flcId,

    })
    res.status(getJobByFlcFollowResult.code).send(getJobByFlcFollowResult.jobs)
}

let delFollow = async (req, res) =>{
    let {empId, flcId, jobId, createdBy} = req.query;

    let delFollowResult = await followService.delFollow({
        flcId,
        empId,
        jobId,
        createdBy
    });
    res.status(delFollowResult.code).send(delFollowResult.message);
}


// let updateTokenWithFlcId = async (req, res) => {
//     let {flcId, tokenDeviceWithFlc} = req.query;

//     let updateTokenWithFlcIdResult = await followService.updateTokenWithFlcId({
//         flcId,
//         tokenDeviceWithFlc,
//     });
//     res.status(updateTokenWithFlcIdResult.code).send(updateTokenWithFlcIdResult.message);
// }



module.exports = {
    createFlcFollowEmp,
    delFollow,
    createEmpFollowFlc,
    createFlcFollowJob,
    getFlcByEmpFollow,
    getJobByFlcFollow,
    //updateTokenWithFlcId,
}