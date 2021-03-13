const express = require("express");
const route = express.Router();
const webAdminController = require("../controller/webAdmin.controller");
const dbConn = require("../middleware/dbConn.middle");

route.get("/", dbConn.conn, webAdminController.loginPage);

route.post("/userLogin", dbConn.conn, webAdminController.userLogin);
module.exports = route;
