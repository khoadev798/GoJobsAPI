const express = require("express");
const route = express.Router();
const dbConn = require("../middleware/dbConn.middle");
const contractController = require("../controller/contract.controller");

route.post(
  "/createNewContract",
  dbConn.conn,
  contractController.addNewContract
);

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

route.delete(
  "/deteledContract",
  dbConn.conn,
  contractController.deleteContractById
);

// Khác biệt giữa 2 trường hợp COMPLETED và CANCELLED là
// cho phép COMPLETED cùng lúc nhiều contracts
route.put(
  "/markContractsCompleted",
  dbConn.conn,
  contractController.markContractsCompleted
);
// chỉ cho phép CANCELLED từng contract riêng biệt
route.put(
  "/markOneContractCancelled",
  dbConn.conn,
  contractController.markOneContractCancelled
);

route.get(
  "/getJobByContractStatus",
  dbConn.conn,
  contractController.getJobByContractStatus
);

route.get(
  "/getContractByJobId",
  dbConn.conn,
  contractController.getContractsByCondition
);

module.exports = route;
