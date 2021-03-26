const express = require("express");
const route = express.Router();
const employerController = require("../controller/employer.controller");
const dbConn = require("../middleware/dbConn.middle");
const infoValidator = require("../middleware/infoValidation.middle");
// const authMiddleware = require("../middleware/authMiddleware");

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

route.post("/updatedEmployerInfo", dbConn.conn, employerController.updatedInfo);

route.put("/updatePassword", dbConn.conn, employerController.updatePassword);

route.get("/empPagination", dbConn.conn, employerController.empPagination);

route.put(
  "/empUpdateToken",
  dbConn.conn,
  employerController.updateTokenWithEmpId
)

module.exports = route;
