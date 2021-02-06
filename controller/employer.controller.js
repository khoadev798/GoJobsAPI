const { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_LIFE } = require("../global/global");
const jwtHelper = require("../helpers/jwt.helper");
const infoValidation = require("../middleware/infoValidation.middle");
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
  });
  // console.log("Employer info:", empInfo);
  const registerResult = await employerService.employerCreate(empInfo);
  res.status(registerResult.code).send({
    message: registerResult.message,
  });
};

let getAllPendingAccounts = async (req, res, next) => {
  let pendingListResult = await employerService.getAllPendingEmployer();
  res.status(pendingListResult.code).send(pendingListResult.pendingList);
};

let login = async (req, res, next) => {
  let { email, password } = req.body;
  const loginResult = await employerService.login({
    email,
    password,
  });
  const accessToken = await jwtHelper.generateToken(
    email,
    ACCESS_TOKEN_SECRET,
    ACCESS_TOKEN_LIFE
  );
  res.status(loginResult.code).send({
    message: loginResult.message,
    userId: loginResult.id,
    accessToken: accessToken,
  });
};

let confirmAccountInfo = async (req, res, next) => {
  console.log("Confirm account info!");
  let { _id, empStatus, empTaxCode, user_id } = req.body;
  let confirmAccountResult = await employerService.updateEmployerStatus({
    _id,
    empStatus,
    empTaxCode,
    user_id,
  });
  res.status(confirmAccountResult.code).send(confirmAccountResult.message);
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

module.exports = {
  register,
  login,
  confirmAccountInfo,
  updatePassword,
  getAllPendingAccounts,
};
