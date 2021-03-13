const express = require("express");
const route = express.Router();
const webAdminController = require("../controller/webAdmin.controller");
const dbConn = require("../middleware/dbConn.middle");

route.use(express.static("public"));

route.get("/", dbConn.conn, webAdminController.loginPage);

route.get("/employer", dbConn.conn, webAdminController.employerManagementPage);

route.post("/adminLogin", dbConn.conn, webAdminController.adminLogin);

route.get("/forgotpassword", function (req, res) {
  res.render("forgotpassword", { layout: false });
});

module.exports = route;
