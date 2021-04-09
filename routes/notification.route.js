const express = require("express");
const route = express.Router();
const notificationController = require("../controller/notification.controller");
const dbConn = require("../middleware/dbConn.middle");
const authMiddleware = require("../middleware/authMiddleware");

route.get(
  "/getNotification",
  authMiddleware.isAuth,
  dbConn.conn,
  notificationController.getNotification
);

route.get(
  "/getNotificationForEmp",
  authMiddleware.isAuth,
  dbConn.conn,
  notificationController.getNotificationForEmp
);

module.exports = route;
