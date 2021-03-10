const express = require("express");
const route = express.Router();
const dbConn = require("../middleware/dbConn.middle");
//const GLOBAL = require("../global/global");
//const client = require("twilio")(GLOBAL.ACCOUNTS_ID, GLOBAL.AUTH_TOKEN);
const OTPController = require("../controller/otp.controller");

route.post("/getOTP",dbConn.conn, OTPController.getOTP);
    // console.log("run post /getOTP")
    // client
    //     .verify
    //     .services(GLOBAL.SERVICE_ID)
    //     .verifications
    //     .create({
    //         to: `+${req.query.phonenumber}`,
    //         channel: req.query.channel
    //     })
    //     .then((data) =>{
    //         res.status(200).send(data);
    //     })
    // }


route.post("/verifyOTP", OTPController.verifyOTP);
//     client
//         .verify
//         .services(GLOBAL.SERVICE_ID)
//         .verificationChecks
//         .create({
//             to: `+${req.query.phonenumber}`,
//             code: req.query.code
//         })
//         .then((data) =>{
//             res.status(200).send(data)
//         })
// })


module.exports = route;
