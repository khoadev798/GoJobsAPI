const mongoose = require("mongoose");
const GLOBAL = require("../global/global");
const Employer = require("../model/employer");
const EmployerModel = mongoose.model("Employer", Employer);
const Freelancer = require("../model/freelancer");
const FreelancerModel = mongoose.model("Freelancer", Freelancer);
const client = require("twilio")(GLOBAL.ACCOUNTS_ID, GLOBAL.AUTH_TOKEN);

let getOTP = async (endUser) => {

  client
    .verify
    .services(GLOBAL.SERVICE_ID)
    .verifications
    .create({
      to: `${"+" + endUser.phone}`,
      channel: "sms"
    })
    .then((data) => console.log("getOTP Success!"))
    .catch((err) => console.log("getOTP Failed! " + err));
  return { code: GLOBAL.SUCCESS_CODE, message: "get OTP Success!" }

};

let verifyOTP = async (endUser) => {

  client
    .verify
    .services(GLOBAL.SERVICE_ID)
    .verificationChecks
    .create({
      to: `+${"+" + endUser.phone}`,
      code: endUser.code
    })
    .then((data) => console.log("verifyOTP Success"))
    .catch((err) => console.log("verifyOTP Failed! " + err))
  return { code: 200, message: "Xac thuc thanh cong" };
}


module.exports = {
  getOTP,
  verifyOTP,
}