const GLOBAL = require("../global/global");

let emailValidate = (req, res, next) => {
  let { email } = req.body;
  console.log(email);
  if (email.match(GLOBAL.EMAIL_REGEX)) {
    console.log("Processing input...");
    next();
  } else {
    res.status(GLOBAL.BAD_REQUEST_CODE).send("Invalid input.");
  }
};

let empEmailValidate = (req, res, next) => {
  let { empEmail } = req.body;
  console.log(empEmail);
  if (empEmail.match(GLOBAL.EMAIL_REGEX)) {
    console.log("Processing input...");
    next();
  } else {
    res.status(GLOBAL.BAD_REQUEST_CODE).send("Invalid input.");
  }
};

let emailPassPhoneValidate = (req, res, next) => {
  let { email, password, phoneNumber } = req.body;
  let correctEmail = email.match(GLOBAL.EMAIL_REGEX);
  let correctPassword = password.match(GLOBAL.PASSWORD_REGEX);
  let correctVNPhone = phoneNumber.match(GLOBAL.VNPHONE_REGEX);

  if (correctEmail && correctPassword && correctVNPhone) {
    console.log("Valid input.");
    next();
  } else {
    res.status(GLOBAL.BAD_REQUEST_CODE).send("Invalid register input.");
  }
};
module.exports = {
  emailValidate,
  empEmailValidate,
};
