const express = require("express");
const route = express.Router();
const dbConn = require("../middleware/dbConn.middle");
const contractController = require("../controller/contract.controller");

route.post("/", dbConn.conn, contractController.addNewContract);

route.get(
  "/contractsByStatusOfFlc",
  dbConn.conn,
  contractController.getContractsByStatusOfFlc
);

route.get(
  "/followsOfEmpForFlc",
  dbConn.conn,
  contractController.getFollowOfEmpForFlc
);

route.get(
  "/contractsByJobIdAndStatus",
  dbConn.conn,
  contractController.getContractsByJobIdAndContractStatus
);

route.put(
  "/updateContractStatusById",
  dbConn.conn,
  contractController.updateContractStatusById
);

route.delete("/", dbConn.conn, contractController.deleteContractById);

route.put(
  "/markContractsCompleted",
  dbConn.conn,
  contractController.markContractsCompleted
);

module.exports = route;
