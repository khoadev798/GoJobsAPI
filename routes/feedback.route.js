const express = require("express");
const route = express.Router();
const flcFeedbackController = require("../controller/feedback.controller");
const authMiddleware = require("../middleware/authMiddleware");
const dbConn = require("../middleware/dbConn.middle");

route.post(
  "/createEmpFeedback",
  authMiddleware.isAuth,
  dbConn.conn,
  flcFeedbackController.createEmpFeedback
);

route.post(
  "/createFlcFeedback",
  authMiddleware.isAuth,
  dbConn.conn,
  flcFeedbackController.createFlcFeedback
);

route.get(
  "/getFeedbackByFlc",
  authMiddleware.isAuth,
  dbConn.conn,
  flcFeedbackController.getFeedbackByFlcId
);

route.get(
  "/getFeedbackByEmp",
  authMiddleware.isAuth,
  dbConn.conn,
  flcFeedbackController.getFeedbackByEmpId
);

route.get(
  "/checkFeedbackExisted",
  authMiddleware.isAuth,
  dbConn.conn,
  flcFeedbackController.checkFlcCreatedFeedback
)

module.exports = route;
