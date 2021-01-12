const mongoose = require("mongoose");
const GLOBAL = require("../global/global");
const EmpType = require("../model/empType");
const EmpTypeModel = mongoose.model("EmpType", EmpType);

let getAllEmpTypes = async () => {
  await EmpTypeModel.find({}, "_id empTypeName", (err, docs) => {
    if (err) return handleError(err);
    console.log(docs);
    return "OK";
  });
};

let empTypeCreate = async (empType) => {
  let isempTypeExisted = await findEmpTypeByName(empType);
  if (isempTypeExisted.code == 404) {
    empType["createdAt"] = new Date();
    let empTypeInstance = new EmpTypeModel(empType);
    empTypeInstance.save((err, obj) => {
      if (err) return handleError(err);
    });
    return { code: 200, message: "Tao thanh cong!" };
  } else {
    return { code: 409, message: "Loai Cong ty da ton tai!" };
  }
};

let empTypeUpdate = async (empType) => {
  let isEmpTypeExisted = await findEmpTypeByName(empType);

  if (isEmpTypeExisted.code == 404) {
    return { code: 404, message: "Loai cong ty khong ton tai" };
  } else {
    let filter = {
      empTypeName: empType.empTypeName,
    };
    let update = {
      empTypeName: empType.newEmpTypeName,
      updatedBy: empType.updatedBy,
      updatedAt: new Date(),
    };

    let doc = await EmpTypeModel.findOneAndUpdate(filter, update, {
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

let findEmpTypeByName = async (empType) => {
  let found;
  await EmpTypeModel.findOne(
    { empTypeName: empType.empTypeName },
    (err, empType1) => {
      if (err) return handleError(err);
      if (empType1) {
        found = { ...empType1._doc };
      }
    }
  );
  if (found == undefined) {
    return {
      code: GLOBAL.NOT_FOUND_CODE,
      message: "Employer Type not found!",
    };
  } else {
    return {
      code: GLOBAL.SUCCESS_CODE,
      message: "Employer Type existed!",
      empType: found,
    };
  }
};

module.exports = {
  getAllEmpTypes,
  empTypeCreate,
  empTypeUpdate,
};
