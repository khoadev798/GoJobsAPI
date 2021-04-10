const express = require("express");
const route = express.Router();
const followController = require("../controller/follow.controller");
const dbConn = require("../middleware/dbConn.middle");
const authMiddleware = require("../middleware/authMiddleware");

route.post("/createFlcFollowEmp", dbConn.conn, followController.createFlcFollowEmp);

route.post(
  "/createEmpFollowFlc",
  authMiddleware.isAuth,
  dbConn.conn,
  followController.createEmpFollowFlc
);

route.post(
  "/createFlcFollowJob",
  authMiddleware.isAuth,
  dbConn.conn,
  followController.createFlcFollowJob
);

route.get(
  "/getJobByFlcFollow",
  authMiddleware.isAuth,
  dbConn.conn,
  followController.getJobByFlcFollow
);

route.get(
  "/getFlcByEmpFollow",
  authMiddleware.isAuth,
  dbConn.conn,
  followController.getFlcByEmpFollow
);

route.get(
  "/getEmpByFlcFollow",
  authMiddleware.isAuth,
  dbConn.conn,
  followController.getEmpByFlcFollow,
)

route.delete("/delFollow", authMiddleware.isAuth,dbConn.conn, followController.delFollow);

// route.post(
//     "/updateTokens",
//     dbConn.conn,
//     followController.updateTokenWithFlcId
// )

module.exports = route;
