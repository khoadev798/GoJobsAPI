const { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_LIFE } = require("../global/global");
const jwtHelpers = require("../helpers/jwt.helper");
const adminService = require("../service/admin.service");

let register = async (req, res, next) => {
  let { name, email, password } = req.body;
  const registerResult = await adminService.adminRegister({
    name,
    email,
    password,
  });
  console.log(registerResult.code);
  res.status(registerResult.code).send({
    message: registerResult.message,
  });
};

let login = async (req, res) => {
  let { email, password } = req.body;
  console.log({ email, password });
  const loginResult = await adminService.login({
    email,
    password,
  });
  // const accessToken = await jwtHelpers.generateToken(
  //   email,
  //   ACCESS_TOKEN_SECRET,
  //   ACCESS_TOKEN_LIFE
  // );
  res.status(loginResult.code).send({
    message: loginResult.message,
    _id: loginResult.id,
    // accessToken: accessToken,
  });
};

let updatePassword = async (req, res, next) => {
  let { email, password, newPassword } = req.query;
  console.log("Update");
  console.log(email, typeof password, typeof newPassword);
  let newPasswordResult = await adminService.updatePassword({
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
  updatePassword,
};
