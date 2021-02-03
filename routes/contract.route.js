const express = require("express");
const route = express.Router();
const dbConn = require("../middleware/dbConn.middle");
const contractController = require("../controller/contract.controller");

route.post("/", dbConn.conn, contractController.addNewContract);

route.get("/", dbConn.conn, contractController.getContractsByStatus);

route.get(
  "/interestedContracts",
  dbConn.conn,
  contractController.getInterestedOrAppliedJobsInfo
);

route.delete("/", dbConn.conn, contractController.deleteContractById);

module.exports = route;
