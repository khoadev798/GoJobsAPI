const coTypeService = require("../service/employerType.service");

let createCompanyType = async (req, res) => {
  let { coTypeName, createdBy } = req.body;
  console.log("New coType name:", coTypeName);
  let coTypeCreateResult = await coTypeService.coTypeCreate({
    coTypeName,
    createdBy,
  });
  //   res.send("New coType here!");
  res.status(coTypeCreateResult.code).send(coTypeCreateResult.message);
};

let getAllCompanyTypes = async (req, res) => {
  let coTypeList = await coTypeService.getAllCompanyTypes();
  res.status(200).send(coTypeList);
};

let updateCompanyType = async (req, res) => {
  let { coTypeName, newCoTypeName, updatedBy } = req.body;
  console.log("Update coType", coTypeName);
  let coTypeUpdateResult = await coTypeService.coTypeUpdate({
    coTypeName,
    newCoTypeName,
    updatedBy,
  });
  res.status(coTypeUpdateResult.code).send(coTypeUpdateResult.message);
};

let deleteCompanyType = (req, res) => {};

module.exports = {
  createCompanyType,
  getAllCompanyTypes,
  updateCompanyType,
  deleteCompanyType,
};
