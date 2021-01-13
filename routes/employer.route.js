const express = require("express");
const companyController = require("../controller/company.controller");
const route = express.Router();

route.post("/", companyController.registerCompany);

route.get("/getAllCompanies", companyController.getAllCompanies);

route.put("/", companyController.updateCompany);

route.delete("/", (req, res) => {
  res.send("Delete company!");
});

module.exports = route;
