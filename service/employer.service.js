const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const GLOBAL = require("../global/global");
const jwtHelper = require("../helpers/jwt.helper");
const { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_LIFE } = require("../global/global");
const Employer = require("../model/employer");
const EmployerModel = mongoose.model("Employer", Employer);
const walletService = require("./wallet.service");
const util = require("../util/data.util");

let employerCreate = async (employer) => {
  let isEmployerExisted = await findEmployerByEmail(employer);
  if (isEmployerExisted.code == 404) {
    employer = util.empHashPassword(employer);
    employer["createdAt"] = new Date();
    let employerInstance = new EmployerModel(employer);
    const session = await mongoose.startSession();
    session.startTransaction();
    let createdEmployer = await employerInstance.save({ session: session });
    let createdWallet = await walletService.createWallet(
      createdEmployer,
      session
    );
    await session.commitTransaction();
    console.log("Created Employer", createdEmployer);
    console.log(
      `Wallet of Employer ${createdEmployer.empEmail}`,
      createdWallet
    );
    session.endSession();
    return { code: 200, message: "Tao tai khoa thanh cong!" };
  } else {
    return { code: 409, message: "Thong tin tai khoan da ton tai!" };
  }
};

let login = async (employer) => {
  const isEmployerExisted = await findEmployerByEmail(employer);
  console.log("Employer login here!" + isEmployerExisted.employer.empPassword);
  console.log(isEmployerExisted);
  if (isEmployerExisted.code == 200) {
    if (
      bcrypt.compareSync(
        employer.empPassword,
        isEmployerExisted.employer.empPassword
      )
    ) {
      console.log("Employer login info correct");
      let _id = isEmployerExisted.employer._id;
      const accessToken = await jwtHelper.generateToken(
        _id,
        ACCESS_TOKEN_SECRET,
        ACCESS_TOKEN_LIFE
      );
      return {
        code: GLOBAL.SUCCESS_CODE,
        message: `Login succeeded!`,
        _id: _id,
        accessToken: accessToken,
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

let updateEmployerInfo = async (employer) => {
  let isEmployerExisted = await findEmployerByEmail(employer);
  if (isEmployerExisted.code == 200) {
    const filter = { empEmail: employer.empEmail };
    if (employer.empName || employer.empNationalId) {
      employer["empStats"] = "Pending";
    }
    const update = employer;
    let doc = await EmployerModel.findOneAndUpdate(filter, update, {
      new: true,
    });
    console.log("Cap nhat info thanh cong: ", doc);
    return { code: 200, message: "Cap nhat info thanh cong", doc };
  } else {
    return { code: 404, message: "Tai khoan khong ton tai" };
  }
};

let findEmployerById = async (employer) => {
  let found = await EmployerModel.findOne(
    {
      _id: employer._id,
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

let findEmployerByEmailOrNationalId = async (employer) => {
  let found = await EmployerModel.findOne(
    {
      $or: [
        { empTaxCode: employer.empNationalId },
        { empEmail: employer.empEmail },
      ],
    },
    (err, doc) => {
      if (err) return handleError(err);
      return doc;
    }
  );

  // console.log(found);

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

let employerPagination = async (pagination) => {
  let searchRegex = new RegExp(pagination.search, "i");
  let match = {
    $match: {
      $or: [
        { empEmail: { $regex: searchRegex } },
        { empName: { $regex: searchRegex } },
      ],
    },
  };

  join = {
    $lookup: {
      from: "wallets",
      localField: "_id",
      foreignField: "empId",
      as: "wallet",
    },
  };

  let skip = {
    $skip: (pagination.pageNumber - 1) * 5,
  };
  let limit = {
    $limit: pagination.pageNumber * 5,
  };

  let sort;
  let employersAndWalletWithConditions;
  if (pagination.sort) {
    sort = {
      $sort: { empName: pagination.sort == "asc" ? 1 : -1 },
    };
    employersAndWalletWithConditions = await EmployerModel.aggregate([
      match,
      join,
      skip,
      limit,
      sort,
    ]);
  } else {
    employersAndWalletWithConditions = await EmployerModel.aggregate([
      match,
      join,
      skip,
      limit,
    ]);
  }

  console.log(employersAndWalletWithConditions[0].wallet);
  return { code: 200, employers: employersAndWalletWithConditions };
};
module.exports = {
  employerCreate,
  login,
  updateEmployerInfo,
  employerPagination,
};
