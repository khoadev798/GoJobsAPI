const express = require("express");
const route = express.Router();
const notificationController = require("../controller/notification.controller");
const dbConn = require("../middleware/dbConn.middle");

route.get(
    "/getNotification",
    dbConn.conn,
    notificationController.getNotification,
)

module.exports = route;