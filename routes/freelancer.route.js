const express = require("express");
const route = express.Router();
const freelancerController = require("../controller/freelancer.controller");
const infoValidation = require("../middleware/infoValidation.middle");
const authMiddleware = require("../middleware/authMiddleware");
const dbConn = require("../middleware/dbConn.middle");

route.post(
  "/createFreelancer",
  infoValidation.emailValidate,
  dbConn.conn,
  freelancerController.createFreelancer
);

route.get(
  "/getAllFreelancer",
  authMiddleware.isAuth,
  dbConn.conn,
  authMiddleware.isAuth,
  freelancerController.getAllFreelancer
);

route.put(
  "/updatePassword",
  dbConn.conn,
  authMiddleware.isAuth,
  freelancerController.updateFreelancer
);

module.exports = route;
