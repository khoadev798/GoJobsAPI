const express = require("express");
const route = express.Router();
const flcFeedbackController = require("../controller/flcFeedback.controller");
const authMiddleware = require("../middleware/authMiddleware");
const dbConn = require("../middleware/dbConn.middle");

route.post(
  "/createFlcFeedback",

  authMiddleware.isAuth,
  dbConn.conn,
  flcFeedbackController.createFlcFeedback
);

route.get(
  "/getFeedback:id",
  authMiddleware.isAuth,
  dbConn.conn,
  flcFeedbackController.getAllFlcFeedback
);

module.exports = route;
