const express = require("express");
const route = express.Router();
const companyTypeController = require("../controller/companyType.controller");
const dbConn = require("../middleware/dbConn.middle");

route.post("/", dbConn.conn, companyTypeController.createCompanyType);

route.get("/", dbConn.conn, companyTypeController.getAllCompanyTypes);

route.put("/", dbConn.conn, companyTypeController.updateCompanyType);

route.delete("/", dbConn.conn, companyTypeController.deleteCompanyType);

module.exports = route;
