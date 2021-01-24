const flcService = require("../service/freelancer.service");

let createFreelancer = async (req, res) =>{
    let { flcEmail, flcPassword, flcTerm } = req.body;
    console.log("new freelancer: ", flcEmail);
    let flcCreateResult = await flcService.flcCreate({
        flcEmail,
        flcPassword,
        flcTerm
    });
    res.status(flcCreateResult.code).send(flcCreateResult.message);
};

let loginFreelancer = async (req, res, next) =>{
    let { flcEmail, flcPassword } = req.body;
    
}

let getAllFreelancer = async (req, res) => {
    let flcList = await flcService.getAllFreelancer();
    res.status(200).send(flcList);
};

let updateFreelancer = async (req, res) =>{
    let { flcEmail, newFlcEmail } = req.body;
    console.log("Update freelancer", flcEmail);
    let flcUpdateResult = await flcService.flcUpdate({
        flcEmail,
        newFlcEmail,
    });
    res.status(flcUpdateResult.code).send(flcUpdateResult.message);
};

let deleteFreelaner = (req, res) =>{};

module.exports = {
    createFreelancer,
    getAllFreelancer,
    updateFreelancer,
    deleteFreelaner,
};