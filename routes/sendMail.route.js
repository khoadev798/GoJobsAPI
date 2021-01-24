const express = require("express");
const route = express.Router();
const sendMailController = require("../controller/sendMail.controller");
const dbConn = require("../middleware/dbConn.middle");

route.post(
    "/sendEmailRePasswordFlc", 
    dbConn.conn,
    sendMailController.sendMailRePasswordFlc
);

// route.post(
//     "/sendEmailRePasswordEmp",
//     dbConn.dbConn,
//     sendMailController.sendMailRePasswordEmp
// );

module.exports = route;