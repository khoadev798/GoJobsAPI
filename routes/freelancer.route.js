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

route.post(
  "/flcLogin",
  dbConn.conn,
  freelancerController.loginFreelancer,
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
  freelancerController.updatePassword
);

route.get(
  "/flcPaginations",
  dbConn.conn,
  freelancerController.flcPagination
) 

route.post(
  "/flcUpdatedInfo",
  dbConn.conn,
  freelancerController.updateFreelancerInfo,
)

route.put(
  "/flcUpdateToken",
  dbConn.conn,
  freelancerController.updateTokenWithFlcId
)

route.get(
  "/flcPaginationAll",
  dbConn.conn,
  freelancerController.flcPaginationAll,
)

route.get(
  "/flcPaginationWithAddress",
  dbConn.conn,
  freelancerController.flcPaginationWithAddress
)

module.exports = route;
