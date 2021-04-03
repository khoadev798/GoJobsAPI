const path = require("path");
const uploadImageHelper = require("../util/cloudHelper");
const multer = require("multer");
const formidable = require("formidable");
let uploadFile = async (req, res, next) => {
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, field, file) => {
    try {
      const myFile = file.empLogo;
      // console.log(file.empLogo);

      const imageUrl = await uploadImageHelper.uploadImage(file.empLogo);
      req.fields = { ...field, imageUrl };
      next();
    } catch (error) {
      res.send(error);
    }
  });
};

module.exports = { uploadFile };
