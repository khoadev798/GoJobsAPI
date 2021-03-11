const mongoose = require("mongoose");
const GLOBAL = require("../global/global");
const Employer = require("../model/employer");
const EmployerModel = mongoose.model("Employer", Employer);
const Freelancer = require("../model/freelancer");
const FreelancerModel = mongoose.model("Freelancer", Freelancer);
const client = require("twilio")(GLOBAL.ACCOUNTS_ID, GLOBAL.AUTH_TOKEN);

let getOTP = async (employer) => {
    let isEmployerExisted = await findEmployerByEmail(employer);
    if (isEmployerExisted.code == 200){
        client
            .verify
            .services(GLOBAL.SERVICE_ID)
            .verifications
            .create({
               to: `${"+"+employer.empPhone}`,
                channel: "sms"
            })
            .then((data) => console.log("getOTP Success!"))
            .catch((err) => console.log("getOTP Failed! " + err));
            return {code: GLOBAL.SUCCESS_CODE, message: "get OTP Success!"}
    }else{
        return { code: 404, message: "Tai khoan khong ton tai"}
    }
};

let verifyOTP = async (employer) =>{
  let isEmployerExisted = await findEmployerByEmail(employer);
  if(isEmployerExisted.code == 200){
    client
      .verify
      .services(GLOBAL.SERVICE_ID)
      .verificationChecks
      .create({
        to: `+${"+"+employer.empPhone}`,
        code: employer.code
      })
      .then((data) => console.log("verifyOTP Success"))
      .catch((err) => console.log("verifyOTP Failed! " + err))
      return { code: 200, message:"Xac thuc thanh cong"};
  }else{
    return { code: 404, message: "Xac thuc that bai"};
  }
}
let getOTPFlc = async (freelancer) => {
  let isFreelancerExisted = await findFreelancerByEmail(freelancer);
  if (isFreelancerExisted.code == 200){
      client
          .verify
          .services(GLOBAL.SERVICE_ID)
          .verifications
          .create({
             to: `${"+"+freelancer.flcPhone}`,
              channel: "sms"
          })
          .then((data) => console.log("getOTP Success!"))
          .catch((err) => console.log("getOTP Failed! " + err));
          return {code: GLOBAL.SUCCESS_CODE, message: "get OTP Success!"}
  }else{
      return { code: 404, message: "Tai khoan khong ton tai"}
  }
};

let verifyOTPFlc = async (freelancer) =>{
  let isFreelancerExisted = await findFreelancerByEmail(freelancer);
  if(isFreelancerExisted.code == 200){
    client
      .verify
      .services(GLOBAL.SERVICE_ID)
      .verificationChecks
      .create({
        to: `+${"+"+freelancer.flcPhone}`,
        code: freelancer.code
      })
      .then((data) => console.log("verifyOTP Success"))
      .catch((err) => console.log("verifyOTP Failed! " + err))
      return { code: 200, message:"Xac thuc thanh cong"};
  }else{
    return { code: 404, message: "Xac thuc that bai"};
  }
}
let findEmployerByEmail = async (employer) => {
  console.log("empEmail: " + employer.empEmail)
  let found = await EmployerModel.findOne(
    {
      empEmail: employer.empEmail,
    },
    "_id empEmail empPassword empNationalId empPhone salt",
    (err, doc) => {
      if (err) return handleError(err);
      return doc;
    }
  );

  if (found == undefined) {
    return {
      code: GLOBAL.NOT_FOUND_CODE,
      message: "Employer not found!",
    };
  } else {
    return {
      code: GLOBAL.SUCCESS_CODE,
      message: "Either email or nationalId taken!",
      employer: found,
    };
  }
};

let findFreelancerByEmail = async (freelancer) => {
  
  let found = await FreelancerModel.findOne(
    {
      flcEmail: freelancer.flcEmail,
    },
    (err, doc) => {
      if (err) return handleError(err);
      return doc;
    }
  );

  if (found == undefined) {
    return {
      code: GLOBAL.NOT_FOUND_CODE,
      message: "Freelancer not found!",
    };
  } else {
    return {
      code: GLOBAL.SUCCESS_CODE,
      message: "Either email or nationalId taken!",
      freelancer: found,
    };
  }
};

  module.exports = {
      getOTP,
      verifyOTP,
      getOTPFlc,
      verifyOTPFlc
  }