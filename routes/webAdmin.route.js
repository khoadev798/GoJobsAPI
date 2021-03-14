const express = require("express");
const route = express.Router();
const webAdminController = require("../controller/webAdmin.controller");
const authenMiddleware = require("../middleware/authMiddleware");
const dbConn = require("../middleware/dbConn.middle");

route.use(express.static("public"));

route.get("/", dbConn.conn, webAdminController.loginPage);

route.get(
  "/main",
  dbConn.conn,
  authenMiddleware.isAuthOnWebAdminFromCookieToken,
  webAdminController.mainPage
);

route.post("/adminLogin", dbConn.conn, webAdminController.adminLogin);

route.get(
  "/employer",
  dbConn.conn,
  authenMiddleware.isAuthOnWebAdminFromCookieToken,
  webAdminController.employerManagementPage
);

route.get("/forgotpassword", function (req, res) {
  res.render("forgotpassword", { layout: false });
});

module.exports = route;
