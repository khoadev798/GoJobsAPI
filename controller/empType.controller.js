const empTypeService = require("../service/empType.service");

let createEmpType = async (req, res) => {
  let { empTypeName, createdBy } = req.body;
  console.log("New empType name:", empTypeName);
  let empTypeCreateResult = await empTypeService.empTypeCreate({
    empTypeName,
    createdBy,
  });
  res.status(empTypeCreateResult.code).send(empTypeCreateResult.message);
};
let getAllEmpTypes = async (req, res) => {
  let getAllEmpTypeResult = await empTypeService.getAllEmpTypes();
  res.status(getAllEmpTypeResult.code).send(getAllEmpTypeResult.empTypeList);
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
