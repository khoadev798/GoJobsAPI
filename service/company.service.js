const mongoose = require("mongoose");
const GLOBAL = require("../global/global");
const Company = require("../model/company");
const CompanyModel = mongoose.model("Company", Company);

let companyCreate = async (company) => {
  let isCompanyExisted = await findCompanyByTaxCodeOrEmail(company);
  if (isCompanyExisted.code == 404) {
    company["createdAt"] = new Date();
    let companyInstance = new CompanyModel(company);
    companyInstance.save((err, obj) => {
      if (err) throw err;
    });
    return { code: 200, message: "Tao cong ty thanh cong!" };
  } else {
    return { code: 409, message: "Cong ty da ton tai!" };
  }
};

let findCompanyByTaxCodeOrEmail = async (company) => {
  let found;
  await CompanyModel.findOne(
    { $or: [({ coTaxCode: company.coTaxCode }, { coEmail: company.coEmail })] },
    (err, company1) => {
      if (err) return handleError(err);
      if (company1) {
        found = { ...company1._doc };
      }
    }
  );

  if (found == undefined) {
    return {
      code: GLOBAL.NOT_FOUND_CODE,
      message: "Company not found!",
    };
  } else {
    return {
      code: GLOBAL.SUCCESS_CODE,
      message: "This tax code has been registered!",
      company: found,
    };
  }
};

module.exports = {
  companyCreate,
};
