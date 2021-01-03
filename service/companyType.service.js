const mongoose = require("mongoose");
const GLOBAL = require("../global/global");
const CompanyType = require("../model/coType");
const CompanyTypeModel = mongoose.model("CompanyType", CompanyType);

let coTypeCreate = async (coType) => {
  let isCoTpeExisted = await findCompanyTypeByName(coType);
  if ((isCoTpeExisted.code = 404)) {
    let coTypeInstance = new CompanyTypeModel(coType);
    coTypeInstance.save((err, obj) => {
      if (err) return handleError(err);
    });
    return { code: 200, message: "Tao thanh cong!" };
  } else {
    return { code: 409, message: "Loai Cong ty da ton tai!" };
  }
};

let findCompanyTypeByName = async (coType) => {
  // const query = await CompanyTypeModel.findOne({
  //   coTypeName: coType.coTypeName,
  // });
  let found;
  console.log(coType);
  await CompanyTypeModel.findOne(
    { coTypeName: coType.coTypeName },
    (err, coType1) => {
      if (err) return handleError(err);
      if (coType1) {
        found = { ...coType1._doc };
      }
    }
  );
  if (found == undefined) {
    return {
      code: GLOBAL.NOT_FOUND_CODE,
      message: "Company Type not found!",
    };
  } else {
    return {
      code: GLOBAL.SUCCESS_CODE,
      message: "Company Type existed!",
      coType: found,
    };
  }
};

module.exports = {
  coTypeCreate,
};
