const express = require("express");
const route = express.Router();
const dbConn = require("../middleware/dbConn.middle");
const messageController = require("../controller/message.controller");

route.post(
    "/newMessage",
    dbConn.conn,
    messageController.newMessage,
)

module.exports = route;