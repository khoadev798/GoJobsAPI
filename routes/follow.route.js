const express = require("express");
const route = express.Router();
const followController = require("../controller/follow.controller");
const dbConn = require("../middleware/dbConn.middle");

route.post(
    "/createFollow",
    dbConn.conn,
    followController.createFollow
);

route.delete(
    "/delFollow",
    dbConn.conn,
    followController.delFollow
);

route.post(
    "/updateTokens",
    dbConn.conn,
    followController.updateTokenWithFlcId
)

module.exports = route;