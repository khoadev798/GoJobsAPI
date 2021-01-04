const mongoose = require("mongoose");
const GLOBAL = require("../global/global");
const CompanyType = require("../model/coType");
const CompanyTypeModel = mongoose.model("CompanyType", CompanyType);

let coTypeCreate = async (coType) => {
  let isCoTpeExisted = await findCompanyTypeByName(coType);
  if (isCoTpeExisted.code == 404) {
    coType["createdAt"] = new Date();
    let coTypeInstance = new CompanyTypeModel(coType);
    coTypeInstance.save((err, obj) => {
      if (err) return handleError(err);
    });
    return { code: 200, message: "Tao thanh cong!" };
  } else {
    return { code: 409, message: "Loai Cong ty da ton tai!" };
  }
};

let coTypeUpdate = async (coType) => {
  let isCoTpeExisted = await findCompanyTypeByName(coType);

  if (isCoTpeExisted.code == 404) {
    return { code: 404, message: "Loai cong ty khong ton tai" };
  } else {
    let filter = {
      coTypeName: coType.coTypeName,
    };
    let update = {
      coTypeName: coType.newCoTypeName,
      updatedBy: coType.updatedBy,
      updatedAt: new Date(),
    };

    let doc = await CompanyTypeModel.findOneAndUpdate(filter, update, {
      new: true,
    });
    if (doc) {
      return {
        code: GLOBAL.SUCCESS_CODE,
        message: "Ten loai cong ty da duoc cap nhat!",
      };
    }
  }
};

let findCompanyTypeByName = async (coType) => {
  // const query = await CompanyTypeModel.findOne({
  //   coTypeName: coType.coTypeName,
  // });
  let found;

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
    // console.log("Kiem tra ton tai", found);

    return {
      code: GLOBAL.NOT_FOUND_CODE,
      message: "Company Type not found!",
    };
  } else {
    // console.log("Kiem tra ton tai", found);

    return {
      code: GLOBAL.SUCCESS_CODE,
      message: "Company Type existed!",
      coType: found,
    };
  }
};

module.exports = {
  coTypeCreate,
  coTypeUpdate,
};
