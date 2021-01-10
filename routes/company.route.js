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

module.exports = route;
