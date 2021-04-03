const path = require("path");
const formidable = require("formidable");
const fs = require("fs");
const util = require("util");

let uploadFile = (req, res, next) => {
  const form = new formidable.IncomingForm();
  form.parse(req, (err, field, file) => {
    let oldPath = file.empLogo.path;
    //   console.log(field);
    let newPath = path.join(
      __dirname,
      "../public/uploads",
      file.empLogo.name + ".jpg"
    );
    fs.copyFile(oldPath, newPath, (err) => {
      req.empLogo = newPath;
      req.fields = { ...field };
      console.log(req.fields);
      next();
    });
  });
};

module.exports = { uploadFile };
