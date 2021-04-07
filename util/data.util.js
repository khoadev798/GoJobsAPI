const bcrypt = require("bcrypt");
const GLOBAL = require("../global/global");
const saltRounds = GLOBAL.SALT_ROUNDS;

let hashPassword = (user) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(user.password, salt);
  user["password"] = hash;
  user["salt"] = salt;
  return user;
};

let empHashPassword = (emp) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(emp.empPassword, salt);
  emp["empPassword"] = hash;
  emp["salt"] = salt;
  return emp;
};

let flcHashPassword = (flc) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(flc.flcPassword, salt);
  flc["flcPassword"] = hash;
  flc["salt"] = salt;
  return flc;
};

module.exports = {
  hashPassword,
  empHashPassword,
  flcHashPassword,
};
