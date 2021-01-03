const coTypeService = require("../service/companyType.service");

let createCompanyType = async (req, res) => {
  let { coTypeName } = req.body;
  console.log("New coType name:", coTypeName);
  let coTypeCreateResult = await coTypeService.coTypeCreate({ coTypeName });
  //   res.send("New coType here!");
  res.status(coTypeCreateResult.code).send(coTypeCreateResult.message);
};

let getAllCompanyTypes = (req, res) => {
  res.send("Get all coTypes here!");
};

let updateCompanyType = (req, res) => {
  let { coTypeId, coTypeName } = req.params;
  console.log("Update coType", coTypeId, coTypeName);
  res.send("Update coType here!");
};

let deleteCompanyType = (req, res) => {};

module.exports = {
  createCompanyType,
  getAllCompanyTypes,
  updateCompanyType,
  deleteCompanyType,
};
