const express = require("express");
const route = express.Router();
const dbConn = require("../middleware/dbConn.middle");
const contractController = require("../controller/contract.controller");
const authMiddleware = require("../middleware/authMiddleware");

route.post(
  "/createNewContract",
  authMiddleware.isAuth,
  dbConn.conn,
  contractController.addNewContract
);

route.get(
  "/contractsByStatusOfFlc",
  authMiddleware.isAuth,
  dbConn.conn,
  contractController.getContractsByStatusOfFlc
);

route.get(
  "/followsOfEmpForFlc",
  authMiddleware.isAuth,
  dbConn.conn,

  contractController.getFollowOfEmpForFlc
);

route.get(
  "/contractsByJobIdAndStatus",
  authMiddleware.isAuth,
  dbConn.conn,

  contractController.getContractsByJobIdAndContractStatus
);

route.put(
  "/updateContractStatusById",
  authMiddleware.isAuth,
  dbConn.conn,
  contractController.updateContractStatusById
);

route.delete(
  "/deteledContract",
  authMiddleware.isAuth,
  dbConn.conn,
  contractController.deleteContractById
);

// Khác biệt giữa 2 trường hợp COMPLETED và CANCELLED là
// cho phép COMPLETED cùng lúc nhiều contracts
route.put(
  "/markContractsCompleted",
  authMiddleware.isAuth,
  dbConn.conn,
  contractController.markContractsCompleted
);
// chỉ cho phép CANCELLED từng contract riêng biệt
route.put(
  "/markOneContractCancelled",
  authMiddleware.isAuth,
  dbConn.conn,
  contractController.markOneContractCancelled
);

route.get(
  "/getJobByContractStatus",
  authMiddleware.isAuth,
  dbConn.conn,
  contractController.getJobByContractStatus
);

route.get(
  "/getContractByJobId",
  authMiddleware.isAuth,
  dbConn.conn,
  contractController.getContractsByCondition
);

route.get("/checkFlcAppliedJob", authMiddleware.isAuth, dbConn.conn, contractController.checkFlcAppliedJob)

module.exports = route;
