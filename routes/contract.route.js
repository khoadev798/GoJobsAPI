const express = require("express");
const route = express.Router();
const dbConn = require("../middleware/dbConn.middle");
const contractController = require("../controller/contract.controller");

route.post("/", (req, res) => {
  res.send("New contract");
});

route.get("/", dbConn.conn, contractController.getContractsByStatus);

module.exports = route;
