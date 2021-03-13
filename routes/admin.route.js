const express = require("express");
const route = express.Router();
const adminController = require("../controller/admin.controller");
const dbConn = require("../middleware/dbConn.middle");
const infoValidator = require("../middleware/infoValidation.middle");
const authMiddleware = require("../middleware/authMiddleware");

route.post(
  "/register",
  infoValidator.emailValidate,
  dbConn.conn,
  adminController.register
);

route.get("/getAll", authMiddleware.isAuth, (req, res) => {
  res.send("Token OK!");
});

route.post("/login", dbConn.conn, adminController.login);

route.put("/updatePassword", dbConn.conn, adminController.updatePassword);

module.exports = route;
