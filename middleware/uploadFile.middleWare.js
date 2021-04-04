const { response } = require("express");
const uploadImageHelper = require("../util/cloudHelper");

let uploadFile = async (req, res, next) => {
  try {
    console.log(req.body);
    const imageUrl = await uploadImageHelper.uploadImage(req.file);
    req.body["imageUrl"] = imageUrl;
    next();
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = { uploadFile };
