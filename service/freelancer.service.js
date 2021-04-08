const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const GLOBAL = require("../global/global");
const Freelancer = require("../model/freelancer");
const FreelancerModel = mongoose.model("Freelancer", Freelancer);
const bcrypt = require("bcrypt");
const walletService = require("./wallet.service");
const jwtHelper = require("../helpers/jwt.helper");
Freelancer.plugin(mongoosePaginate);
const util = require("../util/data.util");
const { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_LIFE } = require("../global/global");

let getAllFreelancer = async () => {
  await FreelancerModel.find({}, "_id flcEmail", (err, docs) => {
    if (err) return handleError(err);
    console.log(docs);
    return "OK";
  });
};

let flcCreate = async (freelancer) => {
  let isFlcExisted = await findFreelancerByEmail(freelancer);
  if (isFlcExisted.code == 404) {
    freelancer = util.flcHashPassword(freelancer);
    freelancer["createAt"] = new Date();
    let flcInstance = new FreelancerModel(freelancer);
    const session = await mongoose.startSession();
    session.startTransaction();
    let createdFreelancer = await flcInstance.save({ session: session });
    let createdWallet = await walletService.createWallet(
      createdFreelancer,
      session
    );
    await session.commitTransaction();
    console.log("Created Freelancer", createdFreelancer);
    console.log(
      `Wallet of Employer ${createdFreelancer.flcEmail}`,
      createdWallet
    );
    session.endSession();
    return { code: 200, message: "Tao thanh cong!" };
  } else {
    return { code: 409, message: "Freelancer da ton tai!" };
  }
};

let login = async (freelancer) => {
  const isFreelancerExisted = await findFreelancerByEmail(freelancer);
  console.log("Freelancer login here!" + isFreelancerExisted.code);
  console.log(isFreelancerExisted);
  const session = await mongoose.startSession();
  session.startTransaction();
  if (isFreelancerExisted.code == 200) {
    if (
      bcrypt.compareSync(
        freelancer.flcPassword,
        isFreelancerExisted.freelancer.flcPassword
      )
    ) {
      console.log("Freelancer login info correct");
      let _id = isFreelancerExisted.freelancer._id;
      const accessToken = await jwtHelper.generateToken(
        _id,
        ACCESS_TOKEN_SECRET,
        ACCESS_TOKEN_LIFE
      );
      let filter = {
        $and: [
          { _id: _id },
          { flcTokenDevice: { $ne: freelancer.flcTokenDevice } },
        ],
      };
      await FreelancerModel.findOneAndUpdate(
        filter,
        { $push: { flcTokenDevice: freelancer.flcTokenDevice } },
        (err, docs) => {
          if (err) handleError(err);
          console.log("add flcTokenDevice", docs);
        }
      );
      await session.commitTransaction();
      session.endSession();
      return {
        code: GLOBAL.SUCCESS_CODE,
        message: `Login succeeded!`,
        _id: _id,
        flcEmail: isFreelancerExisted.freelancer.flcEmail,
        flcName: isFreelancerExisted.freelancer.flcName,
        accessTokenDb: accessToken,
        accessToken: accessToken,
      };
    } else {
      console.log("Incorrect");
      return { code: GLOBAL.BAD_REQUEST_CODE, message: `Login Failed!` };
    }
  } else {
    return {
      code: GLOBAL.NOT_FOUND_CODE,
      message: `User${GLOBAL.NOT_EXISTED_MESSAGE_SUFFIX}`,
    };
  }
};

let flcUpdateInfo = async (freelancer) => {
  let isFlcExisted = await findFreelancerById(freelancer);

  if (isFlcExisted.code == 200) {
    freelancer["updatedInfoAt"] = new Date();
    const filter = { _id: isFlcExisted.freelancer._id };
    const update = freelancer;
    let doc = await FreelancerModel.findOneAndUpdate(filter, update, {
      new: true,
    });
    return {
      code: GLOBAL.SUCCESS_CODE,
      message: "Cap nhat info thanh cong!",
      freelancer: doc,
    };
  } else {
    return { code: GLOBAL.NOT_FOUND_CODE, message: "Tai khoan khong ton tai!" };
  }
};

let flcPagination = async (pagination) => {
  let searchRegex = new RegExp(pagination.search, "i");

  let query = {
    $or: [
      { flcJobTitle: { $regex: searchRegex } },
      { flcMajor: { $regex: searchRegex } },
    ],
  };

  let flcsWithConditions = await FreelancerModel.find(
    query,
    "_id flcName flcAddress flcEmail flcPhone flcBirthday flcAvatar flcSex flcEdu flcMajor flcJobTitle flcRating",
    {
      skip: (pagination.pageNumber - 1) * pagination.pageSize,
      limit: pagination.pageNumber * pagination.pageSize,
    }
  ).sort({
    flcRating: pagination.sort,
  });
  console.log(flcsWithConditions);
  return { code: GLOBAL.SUCCESS_CODE, freelancers: flcsWithConditions };
};

let flcPaginationAll = async (pagination) => {
  let flcPaginationAllInstance = await FreelancerModel.find(
    {},
    "_id flcName flcAddress flcEmail flcPhone flcBirthday flcAvatar flcSex flcEdu flcMajor flcJobTitle flcRating",
    {
      skip: (pagination.pageNumber - 1) * pagination.pageSize,
      limit: pagination.pageNumber * pagination.pageSize,
    }
  ).sort({
    flcRating: pagination.sort,
  });
  return { code: GLOBAL.SUCCESS_CODE, freelancers: flcPaginationAllInstance };
};

let flcPaginationWithAddress = async (pagination) => {
  let searchRegex = new RegExp(pagination.search, "i");
  let query = {
    flcAddress: { $regex: searchRegex },
  };
  let flcsWithConditions = await FreelancerModel.find(
    query,
    "_id flcName flcAddress flcEmail flcPhone flcBirthday flcAvatar flcSex flcEdu flcMajor flcJobTitle flcRating",
    {
      skip: (pagination.pageNumber - 1) * pagination.pageSize,
      limit: pagination.pageNumber * pagination.pageSize,
    }
  ).sort({
    flcRating: pagination.sort,
  });
  return { code: GLOBAL.SUCCESS_CODE, freelancers: flcsWithConditions };
};

let findFreelancerByEmail = async (freelancer) => {
  let found = await FreelancerModel.findOne(
    { flcEmail: freelancer.flcEmail },
    (err, doc) => {
      if (err) return handleError(err);
      return doc;
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

let findFreelancerById = async (freelancer) => {
  let found = await FreelancerModel.findOne(
    { _id: freelancer._id },
    (err, doc) => {
      if (err) return handleError(err);
      return doc;
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

let updateTokenWithFlcId = async (freelancer) => {
  let filter = {
    $and: [
      { _id: freelancer._id },
      { flcTokenDevice: { $eq: freelancer.flcTokenDevice } },
    ],
  };
  await FreelancerModel.findOneAndUpdate(
    filter,
    { $pull: { flcTokenDevice: freelancer.flcTokenDevice } },
    (err, docs) => {
      if (err) return handlerError(err);
      console.log("updated: ", docs);
    }
  );
  return { code: GLOBAL.SUCCESS_CODE, message: "updated success!" };
};

let updatePassword = async (freelancer) => {
  let checkInfo = await login(freelancer);
  if (checkInfo.code == 200) {
    const updatingFlc = util.flcHashPassword({
      flcEmail: freelancer.flcEmail,
      flcPassword: freelancer.flcNewPassword,
    });
    let filter = { flcEmail: updatingFlc.flcEmail };
    let update = {
      flcPassword: updatingFlc.flcPassword,
      salt: updatingFlc.salt,
    };
    let doc = await FreelancerModel.findOneAndUpdate(filter, update, {
      new: true,
    });
    if (doc) {
      return { code: GLOBAL.SUCCESS_CODE, message: "Update success!" };
    }
  } else {
    return {
      code: GLOBAL.BAD_REQUEST_CODE,
      message: "Provided info's incorrect!",
    };
  }
};

let flcPaginationForAdminWeb = async (pagination) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  let searchRegex = new RegExp(pagination.search, "i");
  let match = {
    $match: {
      $or: [
        { flcEmail: { $regex: searchRegex } },
        { flcName: { $regex: searchRegex } },
      ],
    },
  };

  join = {
    $lookup: {
      from: "wallets",
      localField: "_id",
      foreignField: "flcId",
      as: "wallet",
    },
  };

  let skip = {
    $skip: (pagination.pageNumber - 1) * pagination.pageSize,
  };
  let limit = {
    $limit: pagination.pageNumber * pagination.pageSize,
  };

  let sort;
  let flcAndWalletsWithConditions;
  if (pagination.sort) {
    sort = {
      $sort: { flcEmail: pagination.sort == "asc" ? 1 : -1 },
    };
    flcAndWalletsWithConditions = await FreelancerModel.aggregate([
      match,
      join,
      skip,
      limit,
      sort,
    ]);
  } else {
    flcAndWalletsWithConditions = await FreelancerModel.aggregate([
      match,
      join,
      skip,
      limit,
    ]);
  }
  // console.log(flcAndWalletsWithConditions);
  let flcCount = await FreelancerModel.countDocuments({
    $or: [
      { flcEmail: { $regex: searchRegex } },
      { flcName: { $regex: searchRegex } },
    ],
  });
  await session.commitTransaction();
  session.endSession();
  // console.log(flcCount);
  let pageCount = Math.ceil(flcCount / 5);
  return { code: 200, freelancers: flcAndWalletsWithConditions, pageCount };
};

module.exports = {
  getAllFreelancer,
  flcCreate,
  flcUpdateInfo,
  login,
  flcPagination,
  flcPaginationAll,
  updateTokenWithFlcId,
  updatePassword,
  findFreelancerById,
  flcPaginationForAdminWeb,
  flcPaginationWithAddress,
};
