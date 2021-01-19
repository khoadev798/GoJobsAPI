const mongoose = require("mongoose");
const GLOBAL = require("../global/global");
const Employer = require("../model/employer");
const EmployerModel = mongoose.model("Employer", Employer);
const client = require("twilio")(GLOBAL.ACCOUNTS_ID, GLOBAL.AUTH_TOKEN);

let getOTP = async (employer) => {
    let isEmployerExisted = await findEmployerById(employer);
    if (isEmployerExisted.code == 200){
        client
            .verify
            .services(GLOBAL.SERVICE_ID)
            .verifications
            .create({
               to: `${employer.empPhone}`,
                channel: "sms"
            })
            .then((data) =>{
              return {code: 200, message:"Da gui OTP!", Phone: employer.empPhone};
            })
            
    }else{
        return { code: 404, message: "Tai khoan khong ton tai"}
    }
};

let verifyOTP = async (employer) =>{
  let isEmployerExisted = await findEmployerById(employer);
  if(isEmployerExisted.code == 200){
    client
      .verify
      .services(GLOBAL.SERVICE_ID)
      .verificationChecks
      .create({
        to: `+${employer.empPhone}`,
        code: employer.code
      })
      .then((data) =>{
        return { code: 200, message:"Xac thuc thanh cong"};
      });
  }else{
    return { code: 404, message: "Xac thuc that bai"};
  }
}

let findEmployerById = async (employer) => {
    let found;
    await EmployerModel.findOne(
      {
        _id: employer._id,
      },
      (err, employer1) => {
        if (err) return handleError(err);
        if (employer1) {
          found = { ...employer1._doc };
        }
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
        message: "Id found!",
        employer: { ...found },
      };
    }
  };

  module.exports = {
      getOTP,
      verifyOTP
  }