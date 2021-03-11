const express = require("express");
const route = express.Router();
const dbConn = require("../middleware/dbConn.middle");
//const GLOBAL = require("../global/global");
//const client = require("twilio")(GLOBAL.ACCOUNTS_ID, GLOBAL.AUTH_TOKEN);
const OTPController = require("../controller/otp.controller");

route.post("/getOTP",dbConn.conn, OTPController.getOTP);
    
route.post("/verifyOTP", OTPController.verifyOTP);

route.post("/getOTPFlc", dbConn.conn, OTPController.getOTPFlc);

route.post("/verifyOTPFlc", dbConn.conn, OTPController.verifyOTPFlc)

module.exports = route;
