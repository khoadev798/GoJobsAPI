const express = require("express");
const companyController = require("../controller/company.controller");
const route = express.Router();
const dbConn = require("../middleware/dbConn.middle");

route.post("/", dbConn.conn, companyController.registerCompany);

route.get("/getAllCompanies", companyController.getAllCompanies);

route.put("/", companyController.updateCompany);

route.delete("/", (req, res) => {
  res.send("Delete company!");
});

const route = express.Router();
const employerController = require("../controller/employer.controller");
const dbConn = require("../middleware/dbConn.middle");
const infoValidator = require("../middleware/infoValidation.middle");
// const authMiddleware = require("../middleware/authMiddleware");

route.post(
  "/",
  infoValidator.empEmailValidate,
  dbConn.conn,
  employerController.register
);

// route.get("/getAll", authMiddleware.isAuth, (req, res) => {
//   res.send("Token OK!");
// });

route.post("/login", dbConn.conn, employerController.login);

route.put("/updatePassword", dbConn.conn, employerController.updatePassword);

module.exports = route;
