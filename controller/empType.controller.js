const empTypeService = require("../service/empType.service");

let createEmpType = async (req, res) => {
  let { empTypeName, createdBy } = req.body;
  console.log("New coType name:", empTypeName);
  let empTypeCreateResult = await empTypeService.coTypeCreate({
    empTypeName,
    createdBy,
  });
  //   res.send("New coType here!");
  res.status(empTypeCreateResult.code).send(empTypeCreateResult.message);
};

let getAllEmpTypes = async (req, res) => {
  let empTypeList = await empTypeService.getAllEmpTypes();
  res.status(200).send(empTypeList);
};

let updateEmpType = async (req, res) => {
  let { empTypeName, newEmpTypeName, updatedBy } = req.body;
  console.log("Update coType", empTypeName);
  let empTypeUpdateResult = await empTypeService.empTypeUpdate({
    empTypeName,
    newEmpTypeName,
    updatedBy,
  });
  res.status(empTypeUpdateResult.code).send(empTypeUpdateResult.message);
};

let deleteEmpType = (req, res) => {};

module.exports = {
  createEmpType,
  getAllEmpTypes,
  updateEmpType,
  deleteEmpType,
};
