const express = require("express");
const route = express.Router();
const sendMailController = require("../controller/sendMail.controller");
const dbConn = require("../middleware/dbConn.middle");
const authMiddleware = require("../middleware/authMiddleware");

route.post(
  "/sendEmailRePasswordFlc",
  authMiddleware.isAuth,
  dbConn.conn,
  sendMailController.sendMailRePasswordFlc
);

route.post(
  "/sendEmailRePasswordEmp",
  authMiddleware.isAuth,
  dbConn.conn,
  sendMailController.sendMailRePasswordEmp
);

module.exports = route;
