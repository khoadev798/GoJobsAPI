const mongoose = require("mongoose");
const GLOBAL = require("../global/global");
const User = require("../model/user");
const UserModel = mongoose.model("User", User);
const util = require("../util/data.util");
const bcrypt = require("bcrypt");

let userRegister = async (user) => {
  const isUserExisted = await findOneByEmail(user);
  if (isUserExisted.code == 404) {
    user = util.hashPassword(user);
    const userInstance = new UserModel(user);
    userInstance.save((err, obj) => {
      if (err) return handleError(err);
    });
    return {
      code: 200,
      message: `${GLOBAL.REGISTERATION_MESSAGE_PREFIX} ${GLOBAL.SUCCEEDED_MESSAGE_SUFFIX}`,
    };
  } else {
    return { code: 409, message: `User ${GLOBAL.EXISTED_MESSAGE_SUFFIX}` };
  }
};

let login = async (user) => {
  const isUserExisted = await findOneByEmail(user);
  console.log("login here!" + isUserExisted.code);
  if (isUserExisted.code == 200) {
    if (bcrypt.compareSync(user.password, isUserExisted.user.password)) {
      console.log("Correct");
      let _id = isUserExisted.user._id;
      return {
        code: GLOBAL.SUCCESS_CODE,
        message: `Login succeeded!`,
        id: _id,
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

let findOneByEmail = async (user) => {
  const query = await UserModel.findOne({ email: user.email });
  let found;
  await UserModel.findOne({ email: user.email }, (err, user1) => {
    if (err) return handleError(err);
    if (user1) {
      found = { ...user1._doc };
      delete found["salt"];
    }
  });
  if (found == undefined) {
    return {
      code: GLOBAL.NOT_FOUND_CODE,
      message: `User ${GLOBAL.NOT_EXISTED_MESSAGE_SUFFIX}`,
    };
  } else {
    return {
      code: GLOBAL.SUCCESS_CODE,
      message: `User ${GLOBAL.EXISTED_MESSAGE_SUFFIX}`,
      user: found,
    };
  }
};

let updatePassword = async (user) => {
  let checkInfo = await login(user);
  if (checkInfo.code == 200) {
    const updatingUser = util.hashPassword({
      email: user.email,
      password: user.newPassword,
    });
    console.log(updatingUser);
    const filter = { email: updatingUser.email };
    const update = {
      password: updatingUser.password,
      salt: updatingUser.salt,
    };
    let doc = await UserModel.findOneAndUpdate(filter, update, { new: true });
    if (doc) {
      return { code: GLOBAL.SUCCESS_CODE, message: `User's password updated!` };
    }
  } else {
    return {
      code: GLOBAL.BAD_REQUEST_CODE,
      message: `Provided info's incorrect!`,
    };
  }
};

module.exports = {
  userRegister,
  login,
  updatePassword,
};
