const express = require("express");
const route = express.Router();
const freelancerController = require("../controller/freelancer.controller");
const infoValidation = require("../middleware/infoValidation.middle");
const authMiddleware = require("../middleware/authMiddleware");
const dbConn = require("../middleware/dbConn.middle");

route.post(
  "/flcRegister",
  infoValidation.flcEmailValidate,
  dbConn.conn,
  freelancerController.createFreelancer
);

route.post("/flcLogin", dbConn.conn, freelancerController.loginFreelancer);

route.get(
  "/getAllFreelancer",
  authMiddleware.isAuth,
  dbConn.conn,
  freelancerController.getAllFreelancer
);

route.put(
  "/updatePassword",
  authMiddleware.isAuth,
  dbConn.conn,
  freelancerController.updatePassword
);

route.get("/flcPaginations",authMiddleware.isAuth, dbConn.conn, freelancerController.flcPagination);

route.post(
  "/flcUpdatedInfo",
  authMiddleware.isAuth,
  dbConn.conn,
  freelancerController.updateFreelancerInfo
);

route.put(
  "/flcUpdateToken",
  authMiddleware.isAuth,
  dbConn.conn,
  freelancerController.updateTokenWithFlcId
);

route.get(
  "/flcPaginationAll",
  authMiddleware.isAuth,
  dbConn.conn,
  freelancerController.flcPaginationAll
);

route.get(
  "/flcPaginationWithAddress",
  authMiddleware.isAuth,
  dbConn.conn,
  freelancerController.flcPaginationWithAddress
);

route.get("/flcProfile", authMiddleware.isAuth,dbConn.conn, freelancerController.findFreelancerById);

module.exports = route;
