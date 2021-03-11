const GLOBAL = require("../global/global");
const sgMail = require("@sendgrid/mail");
const mongoose = require("mongoose");
const Employer = require("../model/employer");
const EmployerModel = mongoose.model("Employer", Employer);
const Freelancer = require("../model/freelancer");
const FreelancerModel = mongoose.model("Freelancer", Freelancer);
const bcrypt = require("bcrypt");
const saltRounds = 10;
const randomString = require("randomstring");
sgMail.setApiKey(GLOBAL.API_KEY_MAIL);

let sendMailRePasswordFlc = async (freelancer) =>{
    let flcUpdatePasswordResult = await flcUpdatePassword(freelancer); 
    if (flcUpdatePasswordResult.code == 200) {
        const msg = {
            to: freelancer.flcEmail,
            from: {
                name: 'Gojobs Việt Nam',
                email:  GLOBAL.EMAIL_ADMIN,
            },
            subject: "Gojobs - Lấy lại mật khẩu",
            text: "Mật khẩu mới của bạn là: " + flcUpdatePasswordResult.newPassword,
            html:  "Mật khẩu mới của bạn là: " + flcUpdatePasswordResult.newPassword,
        }
             sgMail
            .send(msg)
            .then(() => console.log("sent Mail!"))
        .catch((error) => console.log("Error: " + error));
        return {
            code: GLOBAL.SUCCESS_CODE,
            message: "Sent Mail!",
         }
    
    } else {
        return {
            code: GLOBAL.NOT_FOUND_CODE,
            message: `Freelancer${GLOBAL.NOT_EXISTED_MESSAGE_SUFFIX}`,
        };
    }
};

let sendMailRePasswordEmp = async (employer) =>{
    let empUpdatePasswordResult = await empUpdatePassword(employer);
    if (empUpdatePasswordResult.code == 200) {
        const msg = {
            to: employer.empEmail,
            from: {
                name: 'Gojobs Việt Nam',
                email:  GLOBAL.EMAIL_ADMIN,
            },
            subject: "Gojobs - Lấy lại mật khẩu",
            text:  "Mật khẩu mới của bạn là: " + empUpdatePasswordResult.newPassword,
            html: "Mật khẩu mới của bạn là: " + empUpdatePasswordResult.newPassword,
        }

        sgMail
        .send(msg)
        .then(() => console.log("sent Mail!"))
        .catch((error) => console.log("Error: " + error));
        return {
            code: GLOBAL.SUCCESS_CODE,
            message: "Sent Mail!",
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

let flcUpdatePassword = async (freelancer) => {
  let isFlcExisted = await findFreelancerByEmail(freelancer);
  if (isFlcExisted.code == 200) {
    
    let newPassword = randomString.generate(8);
    console.log("newPass2: " + newPassword);
    bcrypt.genSalt(saltRounds, (err, salt)=> {
      bcrypt.hash(newPassword, salt,  async (err, hash) => {
        const filter = {
          flcEmail: isFlcExisted.freelancer.flcEmail
      };
      console.log("hash: " + hash);
      const update = {
        flcPassword: hash,
        updatedPasswordAt: new Date(),
      };
      let doc = await FreelancerModel.findOneAndUpdate(filter, update, {
        new: true,
      });
      console.log(doc);
      });
    });
    return { code: GLOBAL.SUCCESS_CODE, newPassword: newPassword}
    }
    return { code: GLOBAL.NOT_FOUND_CODE, message: "Tai khoan khong ton tai!"}  
}

let empUpdatePassword = async (employer) => {
  let isEmpExisted = await findEmployerByEmail(employer);
  if (isEmpExisted.code == 200) {
    
    let newPassword = randomString.generate(8);
    console.log("newPass: " + newPassword);
    bcrypt.genSalt(saltRounds, (err, salt)=> {
      bcrypt.hash(newPassword, salt,  async (err, hash) => {
        const filter = {
          empEmail: isEmpExisted.employer.empEmail,
      };
      console.log("hash: " + hash);
      const update = {
        empPassword: hash,
        updatedPasswordAt: new Date(),
      };
      let doc = await EmployerModel.findOneAndUpdate(filter, update, {
        new: true,
      });
      console.log(doc);
      });
    });
    return { code: GLOBAL.SUCCESS_CODE, newPassword: newPassword}
    }
    return { code: GLOBAL.NOT_FOUND_CODE, message: "Tai khoan khong ton tai!"}  
}

  let findFreelancerByEmail = async (freelancer) => {
    let found = await FreelancerModel.findOne(
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