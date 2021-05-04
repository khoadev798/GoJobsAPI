const GLOBAL = require("../global/global");
const sgMail = require("@sendgrid/mail");
const mongoose = require("mongoose");
const Employer = require("../model/employer");
const EmployerModel = mongoose.model("Employer", Employer);
const Freelancer = require("../model/freelancer");
const FreelancerModel = mongoose.model("Freelancer", Freelancer);
const Admin = require("../model/admin");
const AdminModel = mongoose.model("Admin", Admin);
const bcrypt = require("bcrypt");
const saltRounds = 10;
const randomString = require("randomstring");
sgMail.setApiKey(GLOBAL.API_KEY_MAIL);
const util = require("../util/data.util");

let sendMailRePasswordAdmin = async (admin) => {
  let updateAdminEmailResult = await adminUpdatePassword(admin);
  console.log(updateAdminEmailResult);
  if (updateAdminEmailResult.code == 200) {
    const msg = {
      to: admin.email,
      from: {
        name: "Gojobs Việt Nam",
        email: GLOBAL.EMAIL_ADMIN,
      },
      subject: "Gojobs - Lấy lại mật khẩu",
      text: "Mật khẩu mới của bạn là: " + updateAdminEmailResult.newPassword,
      html: "Mật khẩu mới của bạn là: " + updateAdminEmailResult.newPassword,
    };
    sgMail
      .send(msg)
      .then(() => console.log("sent Mail!"))
      .catch((error) => console.log("Error: " + error));
    return {
      code: GLOBAL.SUCCESS_CODE,
      message: "Sent Mail!",
    };
  } else {
    return {
      code: GLOBAL.NOT_FOUND_CODE,
      message: `Freelancer${GLOBAL.NOT_EXISTED_MESSAGE_SUFFIX}`,
    };
  }
};

let adminUpdatePassword = async (admin) => {
  let newPassword = randomString.generate(8);
  console.log("newPass: " + newPassword);
  let newAdmin = util.hashPassword({
    email: admin.email,
    password: newPassword,
  });
  console.log(newAdmin);

  let doc = await AdminModel.findOneAndUpdate(
    { email: admin.email },
    { password: newAdmin.password, salt: newAdmin.salt },
    {
      new: true,
    }
  );
  console.log(doc);
  if (doc) {
    return { code: GLOBAL.SUCCESS_CODE, newPassword };
  } else {
    return {
      code: GLOBAL.NOT_FOUND_CODE,
      message: "Tai khoan khong ton tai!",
    };
  }
};

let sendMailRePasswordFlc = async (freelancer) => {
  let flcUpdatePasswordResult = await flcUpdatePassword(freelancer);
  if (flcUpdatePasswordResult.code == 200) {
    const msg = {
      to: freelancer.flcEmail,
      from: {
        name: "Gojobs Việt Nam",
        email: GLOBAL.EMAIL_ADMIN,
      },
      subject: "Gojobs - Lấy lại mật khẩu",
      text: "Mật khẩu mới của bạn là: " + flcUpdatePasswordResult.newPassword,
      html: "Mật khẩu mới của bạn là: " + flcUpdatePasswordResult.newPassword,
    };
    sgMail
      .send(msg)
      .then(() => console.log("sent Mail!"))
      .catch((error) => console.log("Error: " + error));
    return {
      code: GLOBAL.SUCCESS_CODE,
      message: "Sent Mail!",
    };
  } else {
    return {
      code: GLOBAL.NOT_FOUND_CODE,
      message: `Freelancer${GLOBAL.NOT_EXISTED_MESSAGE_SUFFIX}`,
    };
  }
};

let sendMailRePasswordEmp = async (employer) => {
  let empUpdatePasswordResult = await empUpdatePassword(employer);
  if (empUpdatePasswordResult.code == 200) {
    const msg = {
      to: "cauhuyso096@gmail.com",
      from: {
        name: "Gojobs Việt Nam",
        email: GLOBAL.EMAIL_ADMIN,
      },
      subject: "Gojobs - Lấy lại mật khẩu",
      text: "Mật khẩu mới của bạn là: " + empUpdatePasswordResult.newPassword,
      html: "Mật khẩu mới của bạn là: " + empUpdatePasswordResult.newPassword,
    };

    sgMail
      .send(msg)
      .then((response) => console.log("sent Mail!"))
      .catch((error) => console.log("Error: " + error.message));
    return {
      code: GLOBAL.SUCCESS_CODE,
      message: "Sent Mail!",
    };
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
    bcrypt.genSalt(saltRounds, (err, salt) => {
      bcrypt.hash(newPassword, salt, async (err, hash) => {
        const filter = {
          flcEmail: isFlcExisted.freelancer.flcEmail,
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
    return { code: GLOBAL.SUCCESS_CODE, newPassword: newPassword };
  }
  return { code: GLOBAL.NOT_FOUND_CODE, message: "Tai khoan khong ton tai!" };
};

let empUpdatePassword = async (employer) => {
  let isEmpExisted = await findEmployerByEmail(employer);
  if (isEmpExisted.code == 200) {
    let newPassword = randomString.generate(8);
    console.log("newPass: " + newPassword);
    bcrypt.genSalt(saltRounds, (err, salt) => {
      bcrypt.hash(newPassword, salt, async (err, hash) => {
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
    return { code: GLOBAL.SUCCESS_CODE, newPassword: newPassword };
  }
  return { code: GLOBAL.NOT_FOUND_CODE, message: "Tai khoan khong ton tai!" };
};

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
  sendMailRePasswordAdmin,
};
