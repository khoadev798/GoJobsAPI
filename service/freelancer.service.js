const mongoose = require("mongoose");
const GLOBAL = require("../global/global");
const Freelancer = require("../model/freelancer");
const FreelancerModel = mongoose.model("Freelancer", Freelancer);
const bcrypt = require("bcrypt");


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
    freelancer["createAt"] = new Date();
    let flcInstance = new FreelancerModel(freelancer);
    flcInstance.save((err, obj) => {
      if (err) return handleError(err);
    });
    return { code: 200, message: "Tao thanh cong!" };
  } else {
    return { code: 409, message: "Freelancer da ton tai!" };
  }
};

let login = async (freelancer) => {
    const isFreelancerExisted = await findFreelancerByEmail(freelancer);
    console.log("Freelancer login here!" + isFreelancerExisted.code);
    if(isFreelancerExisted.code == 200) {
      if(
        bcrypt.compareSync(
          freelancer.flcPassword,
          isFreelancerExisted.freelancer.flcPassword
        )
      ){
        console.log("Freelancer login info correct");
        let _id =  isFreelancerExisted.freelancer._id;
        return {
          code: GLOBAL.SUCCESS_CODE,
          message: `Login succeeded!`,
          _id: _id,
        };
      } else {
        console.log("Incorrect");
        return { code: GLOBAL.BAD_REQUEST_CODE, message: `Login Failed!`};
      }
    }else {
      return {
        code: GLOBAL.NOT_FOUND_CODE,
        message: `User${GLOBAL.NOT_EXISTED_MESSAGE_SUFFIX}`,
      };
    }
};

let flcUpdate = async (freelancer) => {
  let isFlcExisted = await findFreelancerByEmail(freelancer);

  if (isFlcExisted.code == 404) {
    return { code: 404, message: "freelancer khong ton tai" };
  } else {
    let filter = {
      flcEmail: freelancer.flcEmail,
    };
    let update = {
      flcEmail: freelancer.newFlcEmail,
      updatedBy: freelancer.updatedBy,
      updatedAt: new Date(),
    };

    let doc = await FreelancerModel.findOneAndUpdate(filter, update, {
      new: true,
    });
    if (doc) {
      return {
        code: GLOBAL.SUCCESS_CODE,
        message: "Ten freelancer da duoc cap nhat!",
      };
    }
  }
};

let findFreelancerByEmail = async (freelancer) => {
  let found;
  await FreelancerModel.findOne(
    { flcEmail: freelancer.flcEmail },
    (err, flc1) => {
      if (err) return handleError(err);
      if (flc1) {
        found = { ...flc1._doc };
      }
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
  flcUpdate,
};
