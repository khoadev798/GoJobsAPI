const express = require("express");
const route = express.Router();
const flcFeedbackController = require("../controller/feedback.controller");
const authMiddleware = require("../middleware/authMiddleware");
const dbConn = require("../middleware/dbConn.middle");

route.post(
  "/createEmpFeedback",

  dbConn.conn,
  flcFeedbackController.createEmpFeedback
);

route.post(
  "/createFlcFeedback",
  dbConn.conn,
  flcFeedbackController.createFlcFeedback,
)

route.get(
  "/getFeedbackByFlc",
  dbConn.conn,
  flcFeedbackController.getFeedbackByFlcId
)

route.get(
  "/getFeedbackByEmp",
  dbConn.conn,
  flcFeedbackController.getFeedbackByEmpId
)

module.exports = route;
