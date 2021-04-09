const express = require("express");
const route = express.Router();
const dbConn = require("../middleware/dbConn.middle");
const messageController = require("../controller/message.controller");
const authMiddleware = require("../middleware/authMiddleware");

route.post("/newMessage", authMiddleware.isAuth,dbConn.conn, messageController.newMessage);

route.get(
  "/getNotificationMessageByEmp",
  authMiddleware.isAuth,
  dbConn.conn,
  messageController.getNotificationMessageByEmp
);

route.get(
  "/getNotificationMessageByFlc",
  authMiddleware.isAuth,
  dbConn.conn,
  messageController.getNotificationMessageByFlc
);

route.get("/getMessageDetail",authMiddleware.isAuth, dbConn.conn, messageController.getMessageDetail);
module.exports = route;
