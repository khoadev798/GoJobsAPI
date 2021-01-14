
const { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_LIFE } = require("../global/global");
const jwtHelpers = require("../helpers/jwt.helpers");
const employerService = require("../service/employer.service");

// empTypeId;
// empId;
// empName;
// empEmail;
// empPassword;
// empPhone;
// empAddress;
// empTaxcode;
// empDescription;
// empLogo;
// registeredAt;
// updatedPasswordAt;
// updatedInfoAt;

let register = async (req, res, next) => {
  let {
    empTypeId,
    empName,
    empEmail,
    empPassword,
    empPhone,
    empAddress,
    empTaxcode,
    empDescription,
    empLogo,
  } = req.body;
  const registerResult = await employerService.userRegister({
    empTypeId,
    empName,
    empEmail,
    empPassword,
    empPhone,
    empAddress,
    empTaxcode,
    empDescription,
    empLogo,
  });
  console.log(registerResult.code);
  res.status(registerResult.code).send({
    message: registerResult.message,
  });
};

let login = async (req, res, next) => {
  let { email, password } = req.body;
  const loginResult = await employerService.login({
    email,
    password,
  });
  const accessToken = await jwtHelpers.generateToken(
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

let updatePassword = async (req, res, next) => {
  let { email, password, newPassword } = req.query;
  console.log("Update");
  console.log(email, typeof password, typeof newPassword);
  let newPasswordResult = await employerService.updatePassword({
    email,
    password,
    newPassword,
  });
  // console.log(newPasswordResult);
  res.status(newPasswordResult.code).send(newPasswordResult.message);
};

let getAllQuestions = (req, res, next) => {
  res.send("Getting all questions...");
};

module.exports = {
  register,
  login,
  getAllQuestions,
  updatePassword,
const companyService = require("../service/company.service");

let registerCompany = async (req, res) => {
  let {
    coTypeId,
    coName,
    coEmail,
    coPassword,
    coPhone,
    coAddress,
    coTaxCode,
    coDescription,
    coLogo,
  } = req.body;
  let companyRegisterResult = await companyService.companyCreate({
    coTypeId,
    coName,
    coEmail,
    coPassword,
    coPhone,
    coAddress,
    coTaxCode,
    coDescription,
    coLogo,
  });
  res.status(companyRegisterResult.code).send(companyRegisterResult.message);
};
let getAllCompanies = (req, res) => {
  res.send("Get all companies!");
};
let updateCompany = (req, res) => {
  res.send("Update company!");
};

module.exports = {
  registerCompany,
  getAllCompanies,
  updateCompany,

};
