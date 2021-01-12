const express = require("express");
const route = express.Router();
const empTypeController = require("../controller/empType.controller");
const dbConn = require("../middleware/dbConn.middle");

route.post("/", dbConn.conn, empTypeController.createEmpType);

route.get("/", dbConn.conn, empTypeController.getAllEmpTypes);

route.put("/", dbConn.conn, empTypeController.updateEmpType);

route.delete("/", dbConn.conn, empTypeController.deleteEmpType);

module.exports = route;
