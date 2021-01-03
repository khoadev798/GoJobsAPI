const express = require("express");
const route = express.Router();
const companyTypeController = require("../controller/companyType.controller");
const dbConn = require("../middleware/dbConn.middle");

route.post("/", dbConn.conn, companyTypeController.createCompanyType);

route.get("/", companyTypeController.getAllCompanyTypes);

route.put("/:coTypeId?/:coTypeName?", companyTypeController.updateCompanyType);

route.delete("/:coTypeId ", companyTypeController.deleteCompanyType);

module.exports = route;
