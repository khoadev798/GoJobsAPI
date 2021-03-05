const express = require("express");
const route = express.Router();
const employerController = require("../controller/employer.controller");
const dbConn = require("../middleware/dbConn.middle");
const infoValidator = require("../middleware/infoValidation.middle");
// const authMiddleware = require("../middleware/authMiddleware");

route.get(
  "/allPendingAccounts",
  dbConn.conn,
  employerController.getAllPendingAccounts
);

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

route.put(
  "/confirmAccount",
  dbConn.conn,
  employerController.confirmAccountInfo
);

route.put("/updatePassword", dbConn.conn, employerController.updatePassword);

module.exports = route;
