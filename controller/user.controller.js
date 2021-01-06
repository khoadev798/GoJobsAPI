const userService = require("../service/user.service");
let register = async (req, res, next) => {
  let { name, email, password } = req.body;
  const registerResult = await userService.userRegister({
    name,
    email,
    password,
  });
  console.log(registerResult.code);
  res.status(registerResult.code).send({
    message: registerResult.message,
  });
};

let login = async (req, res, next) => {
  let { email, password } = req.body;
  const loginResult = await userService.login({
    email,
    password,
  });
  res.status(loginResult.code).send({
    message: loginResult.message,
    userId: loginResult.id,
  });
};

let updatePassword = async (req, res, next) => {
  let { email, password, newPassword } = req.query;
  console.log("Update");
  console.log(email, typeof password, typeof newPassword);
  let newPasswordResult = await userService.updatePassword({
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
