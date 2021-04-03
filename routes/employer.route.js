const express = require("express");
const route = express.Router();
const employerController = require("../controller/employer.controller");
const dbConn = require("../middleware/dbConn.middle");
const infoValidator = require("../middleware/infoValidation.middle");
// const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");
const uploadFileMiddleWare= require("../middleware/uploadFile.middleWare")
route.post(
  "/register",
  infoValidator.empEmailValidate,
  dbConn.conn,
  employerController.register
);

route.post("/empNewFeedback", dbConn.conn, (req, res) => {
  res.send("New feedback");
});

route.post("/login", dbConn.conn, employerController.login);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, './public/uploads');
  },
  filename: function (req, file, cb) {
      cb(null, file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
  } else {
      cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
      fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

route.post("/updatedEmployerInfo", dbConn.conn, uploadFileMiddleWare.uploadFile , employerController.updatedInfo);

route.put("/updatePassword", dbConn.conn, employerController.updatePassword);

route.get("/empPagination", dbConn.conn, employerController.empPagination);

route.put(
  "/empUpdateToken",
  dbConn.conn,
  employerController.updateTokenWithEmpId
)

module.exports = route;
