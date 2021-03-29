const express = require("express");
const route = express.Router();
const dbConn = require("../middleware/dbConn.middle");
const walletController = require("../controller/wallet.controller");

route.get("/getWallet", dbConn.conn, walletController.getWalletInfoOfEndUser);

route.put(
  "/payForAcceptedContracts",
  dbConn.conn,
  walletController.payForAcceptedContracts
);

module.exports = route;
