const infoValidation = require("../middleware/infoValidation.middle");
const Employer = require("../model/employer");
const employerService = require("../service/employer.service");

let register = async (req, res, next) => {
  let {
    empTokenDevice,
    empTypeId, // required
    empName, // required
    empEmail, // required
    empPassword, // required
    empNationalId, // required
    empPhone, // required
    empAddress, // default: null
    empLogo, // default: null
    empDescription, // default: null
    empTerm,
  } = req.body;

  let empInfo = infoValidation.removeUndefinedKeyValue({
    empTypeId,
    empName,
    empEmail,
    empPassword,
    empNationalId,
    empPhone,
    empAddress,
    empLogo,
    empDescription,
    empTerm,
    empTokenDevice
  });
  // console.log("Employer info:", empInfo);

  const registerResult = await employerService.employerCreate(empInfo);
  res.status(registerResult.code).send({
    message: registerResult.message,
  });
  console.log(registerResult);
};

let login = async (req, res, next) => {
  let { empEmail, empPassword, empTokenDevice } = req.body;
  const loginResult = await employerService.login({
    empEmail,
    empPassword,
    empTokenDevice
  });

    res.status(loginResult.code).send({
      message: loginResult.message,
      _id: loginResult._id,
      empEmail: loginResult.empEmail,
      accessTokenDb: loginResult.accessTokenDb,
    });
};

let updatedInfo = async (req, res, next) => {
  console.log("Employer updates info");
  let {
    _id,
    empName,
    empPhone,
    empType,
    empAddress,
    empDescription,
    empLogo,
    empTaxCode,

  } = req.body;
  let updatedInfoResult = await employerService.updateEmployerInfo({
    _id,
    empLogo,
    empTaxCode,
    empName,
    empPhone,
    empType,
    empAddress,
    empDescription,
  });
  res.status(updatedInfoResult.code).send(updatedInfoResult.doc);
};

let updatePassword = async (req, res, next) => {
  console.log("Employer updates password");
  let { email, password, newPassword } = req.query;
  console.log(email, typeof password, typeof newPassword);
  let newPasswordResult = await employerService.updatePassword({
    email,
    password,
    newPassword,
  });
  // console.log(newPasswordResult);
  res.status(newPasswordResult.code).send(newPasswordResult.message);
};

let empPagination = async (req, res) => {
  console.log("Employer paginating...");
  let { search, sort, filter, pageNumber, pageSize } = req.query;

  let empPaginationResult = await employerService.employerPagination({
    search,
    sort,
    filter,
    pageNumber,
    pageSize,
  });
  // console.log(empPaginationResult);
  res.status(empPaginationResult.code).send(empPaginationResult);
};

let updateTokenWithEmpId = async (req, res) =>{
  let {_id, empTokenDevice} = req.query;
  let updateTokenWithEmpIdResult = await employerService.updateTokenWithEmpId({
    _id,
    empTokenDevice,
  });
  res.status(updateTokenWithEmpIdResult.code).send(updateTokenWithEmpIdResult.message);
}

module.exports = {
  register,
  login,
  updatePassword,
  updatedInfo,
  empPagination,
  updateTokenWithEmpId
};
