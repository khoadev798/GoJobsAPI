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

  const registerResult = await employerService.employerCreate(empInfo);
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
};
