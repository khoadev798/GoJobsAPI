const express = require("express");
const route = express.Router();
const dbConn = require("../middleware/dbConn.middle");
const walletController = require("../controller/wallet.controller");
const authMiddleware = require("../middleware/authMiddleware");

route.get("/getWallet",authMiddleware.isAuth, dbConn.conn, walletController.getWalletInfoOfEndUser);

route.put(
  "/payForAcceptedContracts",
  authMiddleware.isAuth,
  dbConn.conn,
  walletController.payForAcceptedContracts
);

route.get(
  "/getWalletByEndUserId",
  authMiddleware.isAuth,
  dbConn.conn,
  walletController.getWallByEndUserId
);

module.exports = route;
