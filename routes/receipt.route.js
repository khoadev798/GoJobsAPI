const express = require("express");
const route = express.Router();
const receiptController = require("../controller/receipt.controller");
const dbConn = require("../middleware/dbConn.middle");

route.get(
    "/getReceiptHistory",
    dbConn.conn,
    receiptController.getReceiptHistory
)

module.exports = route;