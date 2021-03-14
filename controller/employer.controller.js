const infoValidation = require("../middleware/infoValidation.middle");
const Employer = require("../model/employer");
const employerService = require("../service/employer.service");

let register = async (req, res, next) => {
  let {
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
  });
  // console.log("Employer info:", empInfo);
  const registerResult = await employerService.employerCreate(empInfo);
  res.status(registerResult.code).send({
    message: registerResult.message,
  });
};

let login = async (req, res, next) => {
  let { empEmail, empPassword } = req.query;
  const loginResult = await employerService.login({
    empEmail,
    empPassword,
  });
  if (loginResult.code == 200) {
    res.status(loginResult.code).send({
      message: loginResult.message,
      empId: loginResult.id,
      accessToken: loginResult.accessToken,
    });
  }
};

let updatedInfo = async (req, res, next) => {
  console.log("Employer updates info");
  let {
    empName,
    empPhone,
    empType,
    empAddress,
    empDescription,
    empEmail,
    empNationalId,
  } = req.query;
  let updatedInfoResult = await employerService.updateEmployerInfo({
    empName,
    empPhone,
    empType,
    empAddress,
    empDescription,
    empEmail,
    empNationalId,
  });
  res.status(updatedInfoResult.code).send({
    empName: updatedInfoResult.doc.empName,
    empType: updatedInfoResult.doc.empType,
    empPhone: updatedInfoResult.doc.empPhone,
    empAddress: updatedInfoResult.doc.empAddress,
    empDescription: updatedInfoResult.doc.empDescription,
  });
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

  console.log(empPaginationResult);
  res.send(empPaginationResult);
};

module.exports = {
  register,
  login,
  updatePassword,
  updatedInfo,
  empPagination,
};
