const mongoose = require("mongoose");
const GLOBAL = require("../global/global");
const Employer = require("../model/employer");
const EmployerModel = mongoose.model("Employer", Employer);
const util = require("../util/data.util");

let employerCreate = async (employer) => {
  let isEmployerExisted = await findEmployerByEmailOrNationalId(employer);
  if (isEmployerExisted.code == 404) {
    employer = util.empHashPassword(employer);
    employer["createdAt"] = new Date();
    let employerInstance = new EmployerModel(employer);
    employerInstance.save((err, obj) => {
      if (err) throw err;
    });
    return { code: 200, message: "Tao tai khoa thanh cong!" };
  } else {
    return { code: 409, message: "Thong tin tai khoan da ton tai!" };
  }
};

let login = async (employer) => {
  const isEmployerExisted = await findEmployerByEmail(employer);
  console.log("Employer login here!" + isUserExisted.code);
  if (isEmployerExisted.code == 200) {
    if (
      bcrypt.compareSync(
        employer.empPassword,
        isEmployerExisted.employer.empPassword
      )
    ) {
      console.log("Employer login info correct");
      let _id = isEmployerExisted.employer._id;
      return {
        code: GLOBAL.SUCCESS_CODE,
        message: `Login succeeded!`,
        _id: _id,
      };
    } else {
      console.log("Incorrect");
      return { code: GLOBAL.BAD_REQUEST_CODE, message: `Login failed!` };
    }
  } else {
    return {
      code: GLOBAL.NOT_FOUND_CODE,
      message: `User ${GLOBAL.NOT_EXISTED_MESSAGE_SUFFIX}`,
    };
  }
};

let updateEmployerStatus = async (employer) => {
  let isEmployerExisted = await findEmployerById(employer);
  if (isEmployerExisted.code == 200) {
    const filter = { _id: employer._id };
    const update = {
      empStatus: employer.empStatus,
      empTaxCode: employer.empTaxCode,
      confirmedAt: new Date(),
      confirmedBy: employer.user_id,
    };
    let doc = await EmployerModel.findOneAndUpdate(filter, update, {
      new: true,
    });
    console.log("Cap nhat thanh cong:", doc._id, doc.empStatus);
    return { code: 200, message: "Cap nhat status thanh cong!" };
  } else {
    return { code: 404, message: "Tai khoan khong ton tai!" };
  }
};

let getAllPendingEmployer = async () => {
  let pendingList = await EmployerModel.find(
    { empStatus: "Pending" },
    "_id empName empNationalId empStatus"
  ).exec();
  // console.log(pendingList);
  return { code: 200, message: "Pending list", pendingList };
};

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
      employer: { ...found },
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
module.exports = {
  employerCreate,
  login,
  updateEmployerStatus,
  getAllPendingEmployer,
};
