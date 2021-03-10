const GLOBAL = require("../global/global");
const sgMail = require("@sendgrid/mail");
const mongoose = require("mongoose");
const Employer = require("../model/employer");
const EmployerModel = mongoose.model("Employer", Employer);
sgMail.setApiKey(GLOBAL.API_KEY_MAIL);

let sendMailRePasswordFlc = async (freelancer) =>{
    let isFlcExisted = await findFreelancerByEmail(freelancer);
    if (isFlcExisted.code == 200) {
        const msg = {
            to: freelancer.email,
            from: {
                name: 'Gojobs Việt Nam',
                email:  GLOBAL.EMAIL_ADMIN,
            },
            subject: "Gojobs - Lấy lại mật khẩu",
            text: "Mật khẩu của bạn là: " + isFlcExisted.freelancer.flcPassord,
            html:  "Mật khẩu của bạn là: " + isFlcExisted.freelancer.flcPassord,
        }
             sgMail
            .send(msg)
            .then(() => console.log("sent Mail!"))
        .catch((error) => console.log("Error: " + error));
        return {
            code: GLOBAL.SUCCESS_CODE,
            message: "Sent Mail!",
            flcPassord: isEmpExisted.freelancer.flcPassord
         }
    
    } else {
        return {
            code: GLOBAL.NOT_FOUND_CODE,
            message: `Freelancer${GLOBAL.NOT_EXISTED_MESSAGE_SUFFIX}`,
        };
    }
};

let sendMailRePasswordEmp = async (employer) =>{
    let isEmpExisted = await findEmployerByEmail(employer);
    if (isEmpExisted.code == 200) {
        const msg = {
            to: isEmpExisted.employer.empEmail,
            from: {
                name: 'Gojobs Việt Nam',
                email:  GLOBAL.EMAIL_ADMIN,
            },
            subject: "Gojobs - Lấy lại mật khẩu",
            text:  "Mật khẩu của bạn là: " + isEmpExisted.employer.empPassord,
            html: "Mật khẩu của bạn là: " + isEmpExisted.employer.empPassord,
        }

        sgMail
        .send(msg)
        .then(() => console.log("sent Mail!"))
        .catch((error) => console.log("Error: " + error));
        return {
            code: GLOBAL.SUCCESS_CODE,
            message: "Sent Mail!",
            empPassord: isEmpExisted.employer.empPassord
         }
    } else {
        return {
            code: GLOBAL.NOT_FOUND_CODE,
            message: `Employer${GLOBAL.NOT_EXISTED_MESSAGE_SUFFIX}`,
        };
    }
};


let findEmployerByEmail = async (employer) => {
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
    let found;
    await FreelancerModel.findOne(
      { flcEmail: freelancer.flcEmail },
      (err, flc1) => {
        if (err) return handleError(err);
        return flc1;
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
        message: "Freelancer Existed!",
        freelancer: found,
      };
    }
  };

module.exports = {
    sendMailRePasswordEmp,
    sendMailRePasswordFlc,
}