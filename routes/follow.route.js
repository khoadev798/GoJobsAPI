const express = require("express");
const route = express.Router();
const followController = require("../controller/follow.controller");
const dbConn = require("../middleware/dbConn.middle");

route.post(
    "/createFollow",
    dbConn.conn,
    followController.createFlcFollowEmp
);

route.post(
    "/createEmpFollowFlc",
    dbConn.conn,
    followController.createEmpFollowFlc
);

route.post(
    "/createFlcFollowJob",
    dbConn.conn,
    followController.createFlcFollowJob
);

route.get(
    "/getJobByFlcFollow",
    dbConn.conn,
    followController.getJobByFlcFollow
)

route.get(
    "/getFlcByEmpFollow",
    dbConn.conn,
    followController.getFlcByEmpFollow,
)

route.delete(
    "/delFollow",
    dbConn.conn,
    followController.delFollow
);

// route.post(
//     "/updateTokens",
//     dbConn.conn,
//     followController.updateTokenWithFlcId
// )

module.exports = route;