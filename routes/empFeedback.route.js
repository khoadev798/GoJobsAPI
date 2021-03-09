const express = require("express");
const route = express.Router();
const empFeedbackController = require("../controller/empFeedback.controller");
const dbConn = require("../middleware/dbConn.middle");

route.post(
    "/createEmpFeedback",
    dbConn.conn,
    empFeedbackController.createEmpFeedback,
)

route.post(
    "/empFeedbackAVG",
    dbConn.conn,
    empFeedbackController.empFeedbackAVG,
)

module.exports = route;