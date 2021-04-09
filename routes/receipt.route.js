const express = require("express");
const route = express.Router();
const receiptController = require("../controller/receipt.controller");
const dbConn = require("../middleware/dbConn.middle");
const authMiddleware = require("../middleware/authMiddleware");

route.get(
  "/getReceiptHistory",
  authMiddleware.isAuth,
  dbConn.conn,
  receiptController.getReceiptHistory
);

module.exports = route;
