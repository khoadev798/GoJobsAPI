const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate")
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
    freelancer = util.flcHashPassword(freelancer)
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
      return {
        code: GLOBAL.SUCCESS_CODE,
        message: `Login succeeded!`,
        _id: _id,
        flcEmail: isFreelancerExisted.freelancer.flcEmail,
        accessToken: accessToken
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
  let isFlcExisted = await findFreelancerByEmail(freelancer);

  if (isFlcExisted.code == 200) {
    freelancer["updatedInfoAt"] = new Date();
    const filter = { flcEmail: freelancer.flcEmail };
    const update = freelancer;
    let doc = await FreelancerModel.findOneAndUpdate(filter, update, {
      new: true,
    });
    console.log("Cap nhat info thanh cong: ", doc);
    return { code: GLOBAL.SUCCESS_CODE, message: "Cap nhat info thanh cong!", doc }
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
    "_id flcName flcPhone flcBirthda flcAvatar flcSex flcEdu flcMajor flcJobTitle flcRating",
    {
      skip: (pagination.pageNumber - 1) * pagination.pageSize,
      limit: pagination.pageNumber * pagination.pageSize,
    }
  ).sort({
    flcRating: pagination.sort,
  });
  console.log(flcsWithConditions);
  return { code: GLOBAL.SUCCESS_CODE, freelancers: flcsWithConditions };
}

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

module.exports = {
  getAllFreelancer,
  flcCreate,
  flcUpdateInfo,
  login,
  flcPagination,
};
