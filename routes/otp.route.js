const express = require("express");
const route = express.Router();
const dbConn = require("../middleware/dbConn.middle");
//const GLOBAL = require("../global/global");
//const client = require("twilio")(GLOBAL.ACCOUNTS_ID, GLOBAL.AUTH_TOKEN);
const OTPController = require("../controller/otp.controller");

route.post("/getOTP", OTPController.getOTP);

route.post("/verifyOTP", OTPController.verifyOTP);

module.exports = route;
