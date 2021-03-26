const express = require("express");
const route = express.Router();
const dbConn = require("../middleware/dbConn.middle");
const messageController = require("../controller/message.controller");

route.post(
    "/newMessage",
    dbConn.conn,
    messageController.newMessage,
)

route.get(
    "/getNotificationMessageByEmp",
    dbConn.conn,
    messageController.getNotificationMessageByEmp,
)

route.get(
    "/getNotificationMessageByFlc",
    dbConn.conn,
    messageController.getNotificationMessageByFlc
)

route.get(
    "/getMessageDetail",
    dbConn.conn,
    messageController.getMessageDetail
)
module.exports = route;