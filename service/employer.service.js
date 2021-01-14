const mongoose = require("mongoose");
const GLOBAL = require("../global/global");
const Employer = require("../model/employer");
const EmployerModel = mongoose.model("Employer", Employer);

let employerCreate = async (employer) => {
  let isEmployerExisted = await findEmployerByEmailOrNationalId(employer);
  if (isEmployerExisted.code == 404) {
    employer["createdAt"] = new Date();
    let employerInstance = new CompanyModel(employer);
    employerInstance.save((err, obj) => {
      if (err) throw err;
    });
    return { code: 200, message: "Tao tai khoa thanh cong!" };
  } else {
    return { code: 409, message: "Thong tin tai khoan da ton tai!" };
  }
};

let findEmployerByEmailOrNationalId = async (employer) => {
  let found;
  await EmployerModel.findOne(
    {
      $or: [
        ({ empTaxCode: employer.empNationalId },
        { empEmail: employer.empEmail }),
      ],
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
      company: found,
    };
  }
};
module.exports = {
  employerCreate,
};
