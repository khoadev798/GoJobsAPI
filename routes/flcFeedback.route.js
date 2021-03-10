const express = require("express");
const route = express.Router();
const flcFeedbackController = require("../controller/flcFeedback.controller");
const authMiddleware = require("../middleware/authMiddleware");
const dbConn = require("../middleware/dbConn.middle");

route.post(
  "/createFlcFeedback",

  dbConn.conn,
  flcFeedbackController.createFlcFeedback
);

route.post(
  "/flcFeedbackAVG",
  
  dbConn.conn,
  flcFeedbackController.flcFeedbackAVG
);

module.exports = route;
