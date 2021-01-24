const GLOBAL = require("../global/global");
const sgMail = require("@sendgrid/mail");
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
            subject: "Gojobs - Xác nhận đổi mật khẩu",
            text: "Bạn muốn xác nhận mật khẩu hãy nhẫn vào link:  <a href='gojobsvn.xyz/rePassword/confirm'></a>",
            html: "Bạn muốn xác nhận mật khẩu hãy nhẫn vào link:  <a href='gojobsvn.xyz/rePassword/confirm'></a>",
        }
        let email = isFlcExisted.freelancer.email;
        sgMail
            .send(msg)
            .then(() =>{
                console.log("Email sent!");
                return {
                  code: GLOBAL.SUCCESS_CODE,
                  message: `Email sent!`,
                  email: email,
              };
            })
            .catch((error) =>{
              console.log("Incorrect! " + error);
              return { code: GLOBAL.BAD_REQUEST_CODE, message: `Sent email failed!`};
            });
    
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
            to: employer.email,
            from: {
                name: 'Gojobs Việt Nam',
                email:  GLOBAL.EMAIL_ADMIN,
            },
            subject: "Gojobs - Xác nhận đổi mật khẩu",
            text: "Bạn muốn xác nhận mật khẩu hãy nhẫn vào link:  <a href='gojobsvn.xyz/rePassword/confirm'></a>",
            html: "Bạn muốn xác nhận mật khẩu hãy nhẫn vào link:  <a href='gojobsvn.xyz/rePassword/confirm'></a>",
        }
  
        let email = isEmpExisted.employer.email;
        sgMail
            .send(msg)
            .then(() =>{
              return {
                code: GLOBAL.SUCCESS_CODE,
                message: `Email sent!`,
                email: email,
            };
            })
            .catch((error) =>{
              console.log("Incorrect! " + error);
              return { code: GLOBAL.BAD_REQUEST_CODE, message: `Sent email failed!`};
            });
    } else {
        return {
            code: GLOBAL.NOT_FOUND_CODE,
            message: `Employer${GLOBAL.NOT_EXISTED_MESSAGE_SUFFIX}`,
        };
    }
};


let findEmployerByEmail = async (employer) => {
    let found;
    await EmployerModel.findOne(
      {
        email: employer.email,
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
        message: "Either email or nationalId taken!",
        employer: { ...found },
      };
    }
  };

  let findFreelancerByEmail = async (freelancer) => {
    let found;
    await FreelancerModel.findOne(
      { flcEmail: freelancer.flcEmail },
      (err, flc1) => {
        if (err) return handleError(err);
        if (flc1) {
          found = { ...flc1._doc };
        }
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