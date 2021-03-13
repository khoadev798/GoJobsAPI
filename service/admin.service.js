const mongoose = require("mongoose");
const GLOBAL = require("../global/global");
const Admin = require("../model/admin");
const AdminModel = mongoose.model("Admin", Admin);
const util = require("../util/data.util");
const bcrypt = require("bcrypt");

let adminRegister = async (admin) => {
  const isAdminExisted = await findOneByEmail(admin);
  if (isAdminExisted.code == 404) {
    admin = util.hashPassword(admin);
    const adminInstance = new AdminModel(admin);
    adminInstance.save((err, obj) => {
      if (err) return handleError(err);
    });
    return {
      code: 200,
      message: `${GLOBAL.REGISTERATION_MESSAGE_PREFIX} ${GLOBAL.SUCCEEDED_MESSAGE_SUFFIX}`,
    };
  } else {
    return { code: 409, message: `Admin ${GLOBAL.EXISTED_MESSAGE_SUFFIX}` };
  }
};

let login = async (admin) => {
  const isAdminExisted = await findOneByEmail(admin);
  console.log("login here!" + isAdminExisted.code);
  if (isAdminExisted.code == 200) {
    if (bcrypt.compareSync(admin.password, isAdminExisted.admin.password)) {
      console.log("Correct");
      let _id = isAdminExisted.admin._id;
      let email = isAdminExisted.admin.email;
      let name = isAdminExisted.admin.name;
      return {
        code: GLOBAL.SUCCESS_CODE,
        message: `Login succeeded!`,
        admin: {
          _id,
          email,
          name,
        },
      };
    } else {
      console.log("Incorrect");
      return { code: GLOBAL.BAD_REQUEST_CODE, message: `Login failed!` };
    }
  } else {
    return {
      code: GLOBAL.NOT_FOUND_CODE,
      message: `Admin ${GLOBAL.NOT_EXISTED_MESSAGE_SUFFIX}`,
    };
  }
};

let findOneByEmail = async (admin) => {
  const query = await AdminModel.findOne({ email: admin.email });
  // console.log("Query admin email" + query);
  if (query == null) {
    return {
      code: GLOBAL.NOT_FOUND_CODE,
      message: `Admin ${GLOBAL.NOT_EXISTED_MESSAGE_SUFFIX}`,
    };
  } else {
    return {
      code: GLOBAL.SUCCESS_CODE,
      message: `Admin ${GLOBAL.EXISTED_MESSAGE_SUFFIX}`,
      admin: query,
    };
  }
};

let updatePassword = async (admin) => {
  let checkInfo = await login(admin);
  if (checkInfo.code == 200) {
    const updatingAdmin = util.hashPassword({
      email: admin.email,
      password: admin.newPassword,
    });
    console.log(updatingAdmin);
    const filter = { email: updatingAdmin.email };
    const update = {
      password: updatingAdmin.password,
      salt: updatingAdmin.salt,
    };
    let doc = await AdminModel.findOneAndUpdate(filter, update, { new: true });
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
  adminRegister,
  login,
  updatePassword,
};
