const express = require("express");
const route = express.Router();
const webAdminController = require("../controller/webAdmin.controller");
const authenMiddleware = require("../middleware/authMiddleware");
const dbConn = require("../middleware/dbConn.middle");
//On master checking webAdmin
route.use(express.static("public"));

route.get("/", dbConn.conn, webAdminController.loginPage);

route.get(
  "/main",
  authenMiddleware.isAuthOnWebAdminFromCookieToken,
  webAdminController.mainPage
);

route.post("/adminLogin", dbConn.conn, webAdminController.adminLogin);

route.get(
  "/employer",
  authenMiddleware.isAuthOnWebAdminFromCookieToken,
  dbConn.conn,
  webAdminController.employerManagementPage
);

route.get(
  "/freelancer",
  authenMiddleware.isAuthOnWebAdminFromCookieToken,
  dbConn.conn,
  webAdminController.freelancerManagementPage
);

route.get(
  "/job",
  authenMiddleware.isAuthOnWebAdminFromCookieToken,
  dbConn.conn,
  webAdminController.jobManagementPage
);

route.get(
  "/contract",
  authenMiddleware.isAuthOnWebAdminFromCookieToken,
  dbConn.conn,
  webAdminController.contractManagementPage
);

route.get(
  "/receipt",
  authenMiddleware.isAuthOnWebAdminFromCookieToken,
  dbConn.conn,
  webAdminController.receiptManagementPage
);

route.get(
  "/receiptInfo",
  authenMiddleware.isAuthOnWebAdminFromCookieToken,
  dbConn.conn,
  webAdminController.receiptInfoPage
);

route.get(
  "/statistic",
  authenMiddleware.isAuthOnWebAdminFromCookieToken,
  dbConn.conn,
  webAdminController.statisticPage
);

route.get("/forgotpassword", function (req, res) {
  res.render("forgotpassword", { layout: false });
});

route.get(
  "/updateEmpWallet",
  authenMiddleware.isAuthOnWebAdminFromCookieToken,
  webAdminController.updateEmpWalletPage
);

route.post(
  "/updateEmpWalletWithId",
  authenMiddleware.isAuthOnWebAdminFromCookieToken,
  dbConn.conn,
  webAdminController.updateEmpWalletById
);

route.get(
  "/updateFlcWallet",
  authenMiddleware.isAuthOnWebAdminFromCookieToken,
  webAdminController.updateFlcWalletPage
);

route.post(
  "/updateFlcWalletWithId",
  authenMiddleware.isAuthOnWebAdminFromCookieToken,
  dbConn.conn,
  webAdminController.updateFlcWalletById
);

route.get("/error", (req, res) => {
  res.render("error", { layout: false, title: "Error" });
});

module.exports = route;
