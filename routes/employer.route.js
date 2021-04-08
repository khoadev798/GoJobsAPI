const express = require("express");
const route = express.Router();
const employerController = require("../controller/employer.controller");
const dbConn = require("../middleware/dbConn.middle");
const infoValidator = require("../middleware/infoValidation.middle");
const authMiddleware = require("../middleware/authMiddleware");

const uploadFileMiddleWare = require("../middleware/uploadFile.middleWare");
route.post(
  "/register",
  infoValidator.empEmailValidate,
  dbConn.conn,
  employerController.register
);

route.post("/empNewFeedback", dbConn.conn, (req, res) => {
  res.send("New feedback");
});

route.get("/findEmployerById", dbConn.conn, authMiddleware.isAuth,employerController.findEmployerById)

route.post("/login", dbConn.conn, employerController.login);

route.post(
  "/updatedEmployerInfo",
  dbConn.conn,
  authMiddleware.isAuth,
  uploadFileMiddleWare.uploadFile,
  employerController.updatedInfo
);

route.put("/updatePassword", dbConn.conn, authMiddleware.isAuth,employerController.updatePassword);

route.get("/empPagination", dbConn.conn, authMiddleware.isAuth,employerController.empPagination);

route.put(
  "/empUpdateToken",
  dbConn.conn,
  employerController.updateTokenWithEmpId
);

module.exports = route;
